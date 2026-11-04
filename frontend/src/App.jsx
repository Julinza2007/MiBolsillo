import { useCallback, useEffect, useState } from 'react';
import { api, currency, dateLabel, currentPeriod, periodLabel } from './lib/api';
import './App.css';

const localToday = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; };

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Resumen', icon: 'grid' },
  { id: 'transactions', label: 'Movimientos', icon: 'arrows' },
  { id: 'budgets', label: 'Presupuestos', icon: 'wallet' },
  { id: 'categories', label: 'Categorías', icon: 'tag' },
  { id: 'reports', label: 'Estadísticas', icon: 'chart' },
];

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    arrows: <><path d="M7 7h13l-3-3"/><path d="M20 7l-3 3"/><path d="M17 17H4l3 3"/><path d="M4 17l3-3"/></>,
    wallet: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18"/><path d="M16 14h2"/><path d="M7 5V3h11"/></>,
    tag: <><path d="M20 13 13 20 3 10V3h7z"/><circle cx="7.5" cy="7.5" r="1"/></>,
    chart: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-4-4z"/><path d="m13.5 6.5 4 4"/></>,
    trash: <><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="m6 7 1 14h10l1-14"/><path d="M9 7V4h6v3"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/></>,
  };
  return <svg {...common}>{paths[name] || paths.grid}</svg>;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('mibolsillo_token') || '');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mibolsillo_user') || 'null'); } catch { return null; }
  });
  const [page, setPage] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState('');

  const logout = useCallback(() => {
    localStorage.removeItem('mibolsillo_token');
    localStorage.removeItem('mibolsillo_user');
    setToken('');
    setUser(null);
    setPage('dashboard');
  }, []);

  useEffect(() => {
    const handleNavigate = (event) => setPage(event.detail);
    const handleUnauthorized = () => logout();
    window.addEventListener('mibolsillo:navigate', handleNavigate);
    window.addEventListener('mibolsillo:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('mibolsillo:navigate', handleNavigate);
      window.removeEventListener('mibolsillo:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const handleLogin = (session) => {
    localStorage.setItem('mibolsillo_token', session.token);
    localStorage.setItem('mibolsillo_user', JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  };

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  };

  if (!token) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">m</span><span>mi<span className="brand-light">bolsillo</span></span></div>
        <div className="workspace-label">TU ESPACIO</div>
        <nav className="side-nav" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <button className={`nav-item ${page === item.id ? 'active' : ''}`} key={item.id} onClick={() => setPage(item.id)}>
              <Icon name={item.icon}/><span>{item.label}</span>{page === item.id && <span className="nav-active-dot"/>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><div className="note-icon"><Icon name="shield" size={17}/></div><div><strong>Tu dinero, en orden</strong><span>Información privada y segura.</span></div></div>
          <button className="profile-button" onClick={logout}><span className="avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'U'}</span><span className="profile-copy"><strong>{user?.name || 'Usuario'}</strong><small>{user?.email || ''}</small></span><Icon name="logout" size={17}/></button>
        </div>
      </aside>

      <main className="main-column">
        <header className="topbar">
          <div><span className="eyebrow">MI ESPACIO FINANCIERO</span><h1>{NAV_ITEMS.find((item) => item.id === page)?.label || 'Resumen'}</h1></div>
          <div className="topbar-right"><span className="today-label"><Icon name="calendar" size={16}/> {new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' }).format(new Date())}</span><span className="top-avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'U'}</span></div>
        </header>
        <section className="page-content">
          <Workspace page={page} token={token} refreshKey={refreshKey} onRefresh={() => setRefreshKey((value) => value + 1)} notify={notify}/>
        </section>
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const path = mode === 'register' ? '/auth/register' : '/auth/login';
      const session = await api(path, { method: 'POST', body: form });
      onLogin(session);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-screen">
      <div className="auth-decoration decor-one"/><div className="auth-decoration decor-two"/>
      <section className="auth-card">
        <div className="auth-brand"><span className="brand-mark">m</span><span>mi<span className="brand-light">bolsillo</span></span></div>
        <div className="auth-intro"><span className="eyebrow">FINANZAS MÁS SIMPLES</span><h1>{mode === 'login' ? 'Tus números, bajo control.' : 'Empezá a ordenar tu dinero.'}</h1><p>{mode === 'login' ? 'Ingresá a tu espacio personal y seguí de cerca tus finanzas.' : 'Creá tu cuenta y empezá a registrar tus ingresos y gastos.'}</p></div>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && <label>Nombre completo<input autoComplete="name" required minLength="2" maxLength="80" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre"/></label>}
          <label>Correo electrónico<input type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nombre@correo.com"/></label>
          <label>Contraseña<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength="8" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 8 caracteres"/></label>
          {error && <div className="form-error">{error}</div>}
          <button className="button button-primary button-full" disabled={loading}>{loading ? 'Un momento…' : mode === 'login' ? 'Ingresar a mi cuenta' : 'Crear mi cuenta'}</button>
        </form>
        <div className="auth-switch">{mode === 'login' ? '¿Todavía no tenés cuenta?' : '¿Ya tenés una cuenta?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}> {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}</button></div>
        <div className="auth-foot"><Icon name="shield" size={15}/> Tus datos financieros son privados.</div>
      </section>
    </div>
  );
}

function Workspace({ page, token, refreshKey, onRefresh, notify }) {
  const [period, setPeriod] = useState(currentPeriod());
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [transactionModal, setTransactionModal] = useState(null);
  const [budgetModal, setBudgetModal] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      if (page === 'dashboard' || page === 'reports') {
        const [dashboardData, categoryData] = await Promise.all([
          api(`/dashboard?month=${period.month}&year=${period.year}`, { token }),
          api('/categories', { token }),
        ]);
        setData(dashboardData); setCategories(categoryData);
      } else if (page === 'transactions') {
        const params = new URLSearchParams();
        if (typeFilter !== 'all') params.set('type', typeFilter);
        if (categoryFilter !== 'all') params.set('categoryId', categoryFilter);
        if (monthFilter) { params.set('from', `${monthFilter}-01`); const [year, month] = monthFilter.split('-').map(Number); const end = new Date(year, month, 0).getDate(); params.set('to', `${monthFilter}-${String(end).padStart(2, '0')}`); }
        if (search.trim()) params.set('search', search.trim());
        const [movementData, categoryData] = await Promise.all([api(`/transactions?${params}`, { token }), api('/categories', { token })]);
        setTransactions(movementData); setCategories(categoryData);
      } else if (page === 'categories') {
        setCategories(await api('/categories', { token }));
      } else if (page === 'budgets') {
        const [budgetData, categoryData] = await Promise.all([
          api(`/budgets?month=${period.month}&year=${period.year}`, { token }), api('/categories', { token }),
        ]);
        setBudgets(budgetData); setCategories(categoryData);
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page, token, period.month, period.year, typeFilter, categoryFilter, monthFilter, search]);

  // La carga remota sincroniza la pantalla con la API y actualiza el estado al finalizar.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load, refreshKey]);

  const afterSave = () => { setTransactionModal(null); setBudgetModal(null); setCategoryModal(false); onRefresh(); notify('Cambios guardados correctamente.'); };
  const deleteTransaction = async (id) => {
    if (!window.confirm('¿Querés eliminar este movimiento?')) return;
    try { await api(`/transactions/${id}`, { token, method: 'DELETE' }); onRefresh(); notify('Movimiento eliminado.'); }
    catch (err) { notify(err.message); }
  };
  const deleteBudget = async (id) => {
    if (!window.confirm('¿Querés eliminar este presupuesto?')) return;
    try { await api(`/budgets/${id}`, { token, method: 'DELETE' }); onRefresh(); notify('Presupuesto eliminado.'); }
    catch (err) { notify(err.message); }
  };
  const deleteCategory = async (id) => {
    if (!window.confirm('¿Querés eliminar esta categoría?')) return;
    try { await api(`/categories/${id}`, { token, method: 'DELETE' }); onRefresh(); notify('Categoría eliminada.'); }
    catch (err) { notify(err.message); }
  };

  const periodControl = <PeriodControl period={period} onChange={setPeriod}/>;
  if (loading) return <div className="loading-state"><span className="spinner"/> Cargando tu información…</div>;
  if (error) return <div className="error-panel"><strong>No pudimos cargar esta sección</strong><p>{error}</p><button className="button button-secondary" onClick={load}>Reintentar</button></div>;

  if (page === 'dashboard') return <>
    <div className="section-heading"><div><h2>Hola, ¿cómo vienen tus finanzas?</h2><p>Este es el resumen de tu actividad.</p></div>{periodControl}</div>
    <div className="metric-grid">
      <MetricCard label="Balance del período" value={currency(data?.summary.balance)} hint="Ingresos menos gastos" tone="dark" icon="wallet"/>
      <MetricCard label="Ingresos" value={currency(data?.summary.income)} hint="Dinero que ingresó" tone="green" icon="arrow-up"/>
      <MetricCard label="Gastos" value={currency(data?.summary.expenses)} hint="Dinero que salió" tone="coral" icon="arrow-down"/>
      <MetricCard label="Movimientos" value={data?.summary.movements || 0} hint="Registrados este mes" tone="violet" icon="arrows"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel trend-panel"><div className="panel-heading"><div><h3>Movimiento de dinero</h3><p>Ingresos y gastos de los últimos 6 meses</p></div><span className="legend"><i className="legend-income"/> Ingresos <i className="legend-expense"/> Gastos</span></div><TrendChart data={data?.trend || []}/></section>
      <section className="panel category-panel"><div className="panel-heading"><div><h3>En qué gastás</h3><p>Distribución del período</p></div></div><CategoryBreakdown categories={data?.categories || []}/></section>
    </div>
    <div className="dashboard-bottom-grid">
      <section className="panel"><div className="panel-heading"><div><h3>Movimientos recientes</h3><p>Los últimos registros de tu cuenta</p></div><button className="text-button" onClick={() => window.dispatchEvent(new CustomEvent('mibolsillo:navigate', { detail: 'transactions' }))}>Ver todos <Icon name="chevron" size={15}/></button></div><TransactionList rows={data?.recent || []} compact/></section>
      <section className="panel"><div className="panel-heading"><div><h3>Tus presupuestos</h3><p>Seguimiento de este mes</p></div><button className="text-button" onClick={() => window.dispatchEvent(new CustomEvent('mibolsillo:navigate', { detail: 'budgets' }))}>Ver todos <Icon name="chevron" size={15}/></button></div><BudgetPreview budgets={data?.budgets || []}/></section>
    </div>
    <button className="floating-add" onClick={() => setTransactionModal({})}><Icon name="plus" size={20}/> Nuevo movimiento</button>
    {transactionModal && <TransactionModal categories={categories} token={token} onClose={() => setTransactionModal(null)} onSave={afterSave}/>}
  </>;

  if (page === 'transactions') return <>
    <div className="section-heading"><div><h2>Todos tus movimientos</h2><p>Registrá y organizá cada ingreso y gasto.</p></div><button className="button button-primary" onClick={() => setTransactionModal({})}><Icon name="plus"/> Nuevo movimiento</button></div>
    <div className="toolbar"><div className="search-box"><Icon name="search"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por descripción…"/></div><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="all">Todos los movimientos</option><option value="income">Solo ingresos</option><option value="expense">Solo gastos</option></select><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option value="all">Todas las categorías</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><input aria-label="Filtrar por mes" className="month-filter" type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}/></div>
    <section className="panel table-panel"><div className="table-summary"><strong>{transactions.length} movimientos</strong><span>Ordenados por fecha, del más reciente al más antiguo</span></div><TransactionTable rows={transactions} onEdit={(row) => setTransactionModal(row)} onDelete={deleteTransaction}/></section>
    {transactionModal && <TransactionModal categories={categories} token={token} initial={transactionModal.id ? transactionModal : null} onClose={() => setTransactionModal(null)} onSave={afterSave}/>}
  </>;

  if (page === 'categories') return <>
    <div className="section-heading"><div><h2>Organizá tus movimientos</h2><p>Usá categorías para entender mejor tus ingresos y gastos.</p></div><button className="button button-primary" onClick={() => setCategoryModal(true)}><Icon name="plus"/> Nueva categoría</button></div>
    <div className="category-columns"><CategoryGroup title="Categorías de gastos" subtitle="Para clasificar el dinero que sale" type="expense" categories={categories} onDelete={deleteCategory} onEdit={(item) => setCategoryModal(item)}/><CategoryGroup title="Categorías de ingresos" subtitle="Para clasificar el dinero que entra" type="income" categories={categories} onDelete={deleteCategory} onEdit={(item) => setCategoryModal(item)}/></div>
    {categoryModal && <CategoryModal token={token} initial={categoryModal.id ? categoryModal : null} onClose={() => setCategoryModal(false)} onSave={afterSave}/>}
  </>;

  if (page === 'budgets') return <>
    <div className="section-heading"><div><h2>Presupuestos mensuales</h2><p>Definí límites para cuidar tus gastos.</p></div><button className="button button-primary" onClick={() => setBudgetModal({})}><Icon name="plus"/> Crear presupuesto</button></div>
    <div className="period-toolbar">{periodControl}<span>Los gastos se actualizan automáticamente con tus movimientos.</span></div>
    {budgets.length ? <div className="budget-grid">{budgets.map((budget) => <BudgetCard key={budget.id} budget={budget} onEdit={() => setBudgetModal(budget)} onDelete={() => deleteBudget(budget.id)}/>)}</div> : <EmptyState title="Todavía no hay presupuestos" text="Creá un presupuesto por categoría para empezar a controlar tus gastos." action="Crear presupuesto" onClick={() => setBudgetModal({})}/>}
    {budgetModal && <BudgetModal categories={categories.filter((category) => category.type === 'expense')} period={period} token={token} initial={budgetModal.id ? budgetModal : null} onClose={() => setBudgetModal(null)} onSave={afterSave}/>}
  </>;

  if (page === 'reports') return <>
    <div className="section-heading"><div><h2>Conocé tus hábitos</h2><p>Una mirada más clara sobre tu actividad financiera.</p></div>{periodControl}</div>
    <div className="metric-grid reports-metrics"><MetricCard label="Ingresos del período" value={currency(data?.summary.income)} tone="green" icon="arrow-up"/><MetricCard label="Gastos del período" value={currency(data?.summary.expenses)} tone="coral" icon="arrow-down"/><MetricCard label="Balance" value={currency(data?.summary.balance)} tone="dark" icon="wallet"/></div>
    <section className="panel report-chart"><div className="panel-heading"><div><h3>Evolución de los últimos seis meses</h3><p>Comparación de ingresos y gastos</p></div></div><TrendChart data={data?.trend || []} large/></section>
    <section className="panel report-breakdown"><div className="panel-heading"><div><h3>Gastos por categoría</h3><p>{periodLabel(period.month, period.year)}</p></div></div><CategoryBreakdown categories={data?.categories || []} expanded/></section>
  </>;
  return null;
}

function MetricCard({ label, value, hint, tone, icon }) {
  const iconName = icon === 'arrow-up' ? '↗' : icon === 'arrow-down' ? '↘' : icon === 'wallet' ? '▣' : '↔';
  return <article className={`metric-card metric-${tone}`}><div className="metric-top"><span>{label}</span><span className="metric-icon">{iconName}</span></div><strong>{value}</strong>{hint && <small>{hint}</small>}</article>;
}

function PeriodControl({ period, onChange }) {
  return <div className="period-control"><button aria-label="Mes anterior" onClick={() => { const date = new Date(period.year, period.month - 2, 1); onChange({ month: date.getMonth() + 1, year: date.getFullYear() }); }}>‹</button><strong>{periodLabel(period.month, period.year)}</strong><button aria-label="Mes siguiente" onClick={() => { const date = new Date(period.year, period.month, 1); onChange({ month: date.getMonth() + 1, year: date.getFullYear() }); }}>›</button></div>;
}

function TrendChart({ data, large = false }) {
  const maximum = Math.max(1, ...data.flatMap((item) => [Number(item.income), Number(item.expenses)]));
  if (!data.length) return <div className="empty-inline">Todavía no hay datos para mostrar.</div>;
  return <div className={`trend-chart ${large ? 'trend-large' : ''}`}>
    <div className="chart-y-labels"><span>{currency(maximum).replace(',00', '')}</span><span>{currency(maximum / 2).replace(',00', '')}</span><span>$ 0</span></div>
    <div className="chart-plot"><div className="chart-grid-lines"><i/><i/><i/></div>{data.map((item, index) => <div className="chart-month" key={`${item.label}-${index}`}><div className="bar-pair"><div className="bar bar-income" style={{ height: `${Math.max(2, Number(item.income) / maximum * 100)}%` }} title={`Ingresos: ${currency(item.income)}`}/><div className="bar bar-expense" style={{ height: `${Math.max(2, Number(item.expenses) / maximum * 100)}%` }} title={`Gastos: ${currency(item.expenses)}`}/></div><span>{item.label}</span></div>)}</div>
  </div>;
}

function CategoryBreakdown({ categories, expanded = false }) {
  const total = categories.reduce((sum, item) => sum + Number(item.amount), 0);
  const colors = ['#2d8c72', '#e3a15b', '#6575bd', '#d77b76', '#8c77b5', '#76a8a0'];
  if (!categories.length) return <div className="empty-inline">Todavía no hay gastos en este período.</div>;
  return <div className={`category-breakdown ${expanded ? 'breakdown-expanded' : ''}`}>
    {!expanded && <div className="donut-wrap"><div className="donut" style={{ background: `conic-gradient(${categories.map((item, index) => `${colors[index % colors.length]} ${categories.slice(0, index).reduce((sum, x) => sum + Number(x.amount) / total * 100, 0)}% ${categories.slice(0, index + 1).reduce((sum, x) => sum + Number(x.amount) / total * 100, 0)}%`).join(', ')})` }}><div className="donut-center"><strong>{currency(total).replace(',00', '')}</strong><span>Total gastado</span></div></div></div>}
    <div className="category-legend">{categories.map((item, index) => <div className="category-legend-row" key={item.name}><span className="category-dot" style={{ background: colors[index % colors.length] }}/><span className="category-name">{item.name}</span><strong>{currency(item.amount)}</strong>{expanded && <span className="category-share">{total ? Math.round(Number(item.amount) / total * 100) : 0}%</span>}</div>)}</div>
  </div>;
}

function TransactionList({ rows, compact = false }) {
  if (!rows.length) return <div className="empty-inline">Todavía no registraste movimientos.</div>;
  return <div className={`transaction-list ${compact ? 'transaction-list-compact' : ''}`}>{rows.map((row) => <div className="transaction-row" key={row.id}><span className={`movement-symbol ${row.type}`} >{row.type === 'income' ? '↙' : '↗'}</span><span className="movement-main"><strong>{row.description}</strong><small>{row.categoryName} · {dateLabel(row.date)}</small></span><strong className={`movement-amount ${row.type}`}>{row.type === 'income' ? '+' : '−'}{currency(row.amount)}</strong></div>)}</div>;
}

function TransactionTable({ rows, onEdit, onDelete }) {
  if (!rows.length) return <EmptyState title="No encontramos movimientos" text="Probá cambiar los filtros o registrá tu primer movimiento."/>;
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Descripción</th><th>Categoría</th><th>Fecha</th><th>Tipo</th><th className="align-right">Importe</th><th/></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.description}</strong></td><td>{row.categoryName}</td><td>{dateLabel(row.date)}</td><td><span className={`type-pill ${row.type}`}>{row.type === 'income' ? 'Ingreso' : 'Gasto'}</span></td><td className={`align-right movement-amount ${row.type}`}>{row.type === 'income' ? '+' : '−'}{currency(row.amount)}</td><td><div className="row-actions"><button aria-label="Editar movimiento" onClick={() => onEdit(row)}><Icon name="edit" size={16}/></button><button aria-label="Eliminar movimiento" onClick={() => onDelete(row.id)}><Icon name="trash" size={16}/></button></div></td></tr>)}</tbody></table></div>;
}

function BudgetPreview({ budgets }) {
  if (!budgets.length) return <div className="empty-inline">Todavía no creaste presupuestos.</div>;
  return <div className="budget-preview-list">{budgets.map((budget) => <div className="budget-preview" key={budget.id}><div><strong>{budget.categoryName}</strong><span>{currency(budget.spent)} de {currency(budget.amount)}</span></div><ProgressBar value={budget.spent} total={budget.amount}/></div>)}</div>;
}

function ProgressBar({ value, total }) {
  const percentage = total > 0 ? Math.min(100, Number(value) / Number(total) * 100) : 0;
  const exceeded = Number(value) >= Number(total);
  return <div className={`progress-track ${exceeded ? 'progress-exceeded' : ''}`}><span style={{ width: `${percentage}%` }}/></div>;
}

function BudgetCard({ budget, onEdit, onDelete }) {
  const percentage = budget.amount > 0 ? Math.round(budget.spent / budget.amount * 100) : 0;
  return <article className="budget-card"><div className="budget-card-head"><span className="budget-category-icon">◫</span><div className="budget-card-actions"><button aria-label="Editar presupuesto" onClick={onEdit}><Icon name="edit" size={16}/></button><button aria-label="Eliminar presupuesto" onClick={onDelete}><Icon name="trash" size={16}/></button></div></div><h3>{budget.categoryName}</h3><div className="budget-amounts"><strong>{currency(budget.spent)}</strong><span>de {currency(budget.amount)}</span></div><ProgressBar value={budget.spent} total={budget.amount}/><div className="budget-foot"><span>{percentage}% utilizado</span><strong className={budget.exceeded ? 'over-budget' : ''}>{budget.exceeded ? `Excedido ${currency(budget.spent - budget.amount)}` : `Quedan ${currency(budget.amount - budget.spent)}`}</strong></div></article>;
}

function CategoryGroup({ title, subtitle, type, categories, onDelete, onEdit }) {
  const list = categories.filter((category) => category.type === type);
  return <section className="panel category-group"><div className="panel-heading"><div><h3>{title}</h3><p>{subtitle}</p></div><span className="count-pill">{list.length}</span></div><div className="category-list">{list.map((category) => <div className="category-list-item" key={category.id}><span className={`category-icon ${type}`}>{type === 'income' ? '↙' : '↗'}</span><span className="category-list-name">{category.name}{category.isDefault && <small>Predefinida</small>}</span>{!category.isDefault && <><button aria-label={`Editar ${category.name}`} onClick={() => onEdit(category)}><Icon name="edit" size={16}/></button><button aria-label={`Eliminar ${category.name}`} onClick={() => onDelete(category.id)}><Icon name="trash" size={16}/></button></>}</div>)}</div></section>;
}

function EmptyState({ title, text, action, onClick }) {
  return <div className="empty-state"><span className="empty-illustration">◎</span><h3>{title}</h3><p>{text}</p>{action && <button className="button button-primary" onClick={onClick}>{action}</button>}</div>;
}

function Modal({ title, subtitle, onClose, children }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button></div>{children}</section></div>;
}

function TransactionModal({ categories, token, initial, onClose, onSave }) {
  const [form, setForm] = useState({ type: initial?.type || 'expense', description: initial?.description || '', amount: initial?.amount ?? '', date: initial?.date || localToday(), categoryId: initial?.categoryId || '' });
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const available = categories.filter((category) => category.type === form.type);
  const selectedCategoryId = available.some((category) => String(category.id) === String(form.categoryId)) ? String(form.categoryId) : String(available[0]?.id || '');
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { await api(initial?.id ? `/transactions/${initial.id}` : '/transactions', { token, method: initial?.id ? 'PUT' : 'POST', body: { ...form, amount: String(form.amount), categoryId: Number(selectedCategoryId) } }); onSave(); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  return <Modal title={initial?.id ? 'Editar movimiento' : 'Nuevo movimiento'} subtitle="Registrá los detalles de tu movimiento." onClose={onClose}><form className="modal-form" onSubmit={submit}><div className="segmented"><button type="button" className={form.type === 'expense' ? 'selected expense' : ''} onClick={() => setForm({ ...form, type: 'expense', categoryId: '' })}>Gasto</button><button type="button" className={form.type === 'income' ? 'selected income' : ''} onClick={() => setForm({ ...form, type: 'income', categoryId: '' })}>Ingreso</button></div><label>Descripción<input required minLength="2" maxLength="140" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ej. Compra del supermercado"/></label><label>Importe (ARS)<input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0,00"/></label><div className="form-two"><label>Fecha<input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}/></label><label>Categoría<select required value={selectedCategoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}><option value="" disabled>Seleccionar</option>{available.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancelar</button><button className="button button-primary" disabled={saving || !available.length}>{saving ? 'Guardando…' : 'Guardar movimiento'}</button></div></form></Modal>;
}

function CategoryModal({ token, initial, onClose, onSave }) {
  const [form, setForm] = useState({ name: initial?.name || '', type: initial?.type || 'expense' }); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { await api(initial?.id ? `/categories/${initial.id}` : '/categories', { token, method: initial?.id ? 'PUT' : 'POST', body: form }); onSave(); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  return <Modal title="Nueva categoría" subtitle="Creá una categoría para ordenar tus movimientos." onClose={onClose}><form className="modal-form" onSubmit={submit}><label>Nombre<input required minLength="2" maxLength="50" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Mascotas"/></label><label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="expense">Gasto</option><option value="income">Ingreso</option></select></label>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancelar</button><button className="button button-primary" disabled={saving}>{saving ? 'Guardando…' : initial?.id ? 'Guardar cambios' : 'Crear categoría'}</button></div></form></Modal>;
}

function BudgetModal({ categories, period, token, initial, onClose, onSave }) {
  const [form, setForm] = useState({ categoryId: initial?.categoryId || categories[0]?.id || '', amount: initial?.amount ?? '', month: initial?.month || period.month, year: initial?.year || period.year });
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { await api(initial?.id ? `/budgets/${initial.id}` : '/budgets', { token, method: initial?.id ? 'PUT' : 'POST', body: { ...form, categoryId: Number(form.categoryId), month: Number(form.month), year: Number(form.year), amount: String(form.amount) } }); onSave(); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  return <Modal title={initial?.id ? 'Editar presupuesto' : 'Nuevo presupuesto'} subtitle="Definí cuánto querés destinar a una categoría." onClose={onClose}><form className="modal-form" onSubmit={submit}><label>Categoría de gasto<select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Límite mensual (ARS)<input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0,00"/></label><div className="form-two"><label>Mes<select value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(new Date(2025, index, 1))}</option>)}</select></label><label>Año<input type="number" min="2000" max="2100" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}/></label></div>{error && <div className="form-error">{error}</div>}<div className="modal-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancelar</button><button className="button button-primary" disabled={saving || !categories.length}>{saving ? 'Guardando…' : 'Guardar presupuesto'}</button></div></form></Modal>;
}

export default App;
