import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Database,
  GitBranch,
  HardHat,
  Layers3,
  Map,
  Menu,
  Network,
  Route,
  Settings2,
  ShieldCheck,
  X,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type LifecycleStage = {
  short: string
  title: string
  purpose: string
  users: string[]
  activities: string[]
  information: string[]
  decisions: string[]
  dependencies: string[]
  capabilities: string[]
  measures: string[]
}

const lifecycle: LifecycleStage[] = [
  {
    short: 'Intake',
    title: 'Ideation and Project Intake',
    purpose: 'Capture transportation needs and shape a consistent early project record.',
    users: ['District planners', 'Program staff', 'Safety teams', 'Stakeholder coordinators'],
    activities: ['Document needs and deficiencies', 'Collect district and stakeholder requests', 'Define preliminary scope and anticipated outcomes'],
    information: ['Safety, mobility, condition, and policy drivers', 'Project location and GIS data', 'Preliminary cost range', 'Supporting studies and documents'],
    decisions: ['Advance for evaluation', 'Request more information', 'Associate with a corridor or program'],
    dependencies: ['Source-data availability', 'Sponsoring office', 'Initial location and scope'],
    capabilities: ['Guided intake', 'GIS-enabled records', 'Document links', 'Benefits framing'],
    measures: ['Candidate volume', 'Record completeness', 'Intake age', 'Needs by category'],
  },
  {
    short: 'Prioritize',
    title: 'Evaluation and Prioritization',
    purpose: 'Organize evidence and comparisons for agency-led investment discussions.',
    users: ['Planning teams', 'Program leaders', 'Finance staff', 'Agency leadership'],
    activities: ['Apply configurable scoring criteria', 'Compare scenarios', 'Review benefits, impacts, readiness, and policy considerations'],
    information: ['Safety and asset-condition factors', 'Funding eligibility', 'Equity or policy factors where applicable', 'Readiness evidence'],
    decisions: ['Prioritization recommendation', 'Scenario selection', 'Candidate refinement'],
    dependencies: ['Agreed criteria', 'Comparable project information', 'Leadership review'],
    capabilities: ['Scoring models', 'Scenario comparison', 'Review workflow', 'Decision history'],
    measures: ['Readiness status', 'Score completeness', 'Review cycle', 'Scenario movement'],
  },
  {
    short: 'Program',
    title: 'STIP Development and Programming',
    purpose: 'Support agency STIP development and coordination while connecting programming choices to delivery conditions.',
    users: ['STIP managers', 'Finance teams', 'MPO coordinators', 'Program leaders'],
    activities: ['Build candidate and programmed portfolios', 'Assign funds by fiscal year', 'Coordinate amendments and administrative modifications'],
    information: ['Federal, state, local, grant, bond, and other funding', 'Authorization and obligation status', 'Program balance', 'MPO and stakeholder coordination'],
    decisions: ['Program selection', 'Funding assignment', 'Fiscal-year placement', 'Amendment action'],
    dependencies: ['Funding eligibility', 'Delivery readiness', 'Fiscal constraints', 'Planning coordination'],
    capabilities: ['STIP coordination', 'Program balancing', 'Funding structures', 'Amendment workflow'],
    measures: ['Obligation risk', 'Amendment activity', 'Funding gaps', 'Milestone confidence'],
  },
  {
    short: 'Develop',
    title: 'Project Development',
    purpose: 'Track work, documents, decisions, and milestones across project development disciplines.',
    users: ['Project managers', 'Engineers', 'Environmental staff', 'Right-of-way and utility teams'],
    activities: ['Track preliminary engineering and design reviews', 'Coordinate permitting, utilities, railroad, and right-of-way', 'Document public and stakeholder engagement'],
    information: ['Environmental-review workflow status', 'Permits and approvals', 'Design milestones', 'Risks, issues, and dependencies'],
    decisions: ['Stage-gate readiness', 'Design acceptance workflow', 'Dependency escalation'],
    dependencies: ['Professional engineering work', 'Agency and regulatory determinations', 'Property and utility coordination'],
    capabilities: ['Milestone controls', 'Cross-team workflow', 'Documented handoffs', 'Risk registers'],
    measures: ['Review age', 'Dependency status', 'Design milestone performance', 'Decision time'],
  },
  {
    short: 'Procure',
    title: 'Procurement and Pre-Construction',
    purpose: 'Coordinate bid and contract readiness while receiving relevant records from procurement systems.',
    users: ['Procurement staff', 'Project managers', 'Contract teams', 'Construction leaders'],
    activities: ['Assess bid-package readiness', 'Track estimates and approvals', 'Coordinate long-lead planning and notice to proceed'],
    information: ['Procurement milestones', 'Contractor and vendor information', 'Baseline schedule and budget', 'Materials planning'],
    decisions: ['Release readiness', 'Contract approval status', 'Notice-to-proceed readiness'],
    dependencies: ['Authoritative procurement process', 'Approved plans and estimates', 'Funding and contract approvals'],
    capabilities: ['Readiness checklists', 'Contract-data integration', 'Milestone alerts', 'Baseline records'],
    measures: ['Bid-package readiness', 'Approval age', 'Long-lead exposure', 'Baseline completeness'],
  },
  {
    short: 'Construct',
    title: 'Construction Management',
    purpose: 'Connect construction status, fiscal performance, field conditions, and executive reporting.',
    users: ['Construction teams', 'Resident engineers', 'Contract administrators', 'Program leaders'],
    activities: ['Monitor schedules, milestones, commitments, and expenditures', 'Coordinate change orders, RFIs, submittals, and field issues', 'Maintain forecasts and executive views'],
    information: ['Materials and equipment', 'Contractor performance', 'Schedule and cost variance', 'Risks and issues'],
    decisions: ['Issue escalation', 'Change workflow', 'Forecast update', 'Closeout readiness'],
    dependencies: ['Field and contract systems', 'Human-reviewed inspection records', 'Approved change processes'],
    capabilities: ['Construction summary', 'Change tracking', 'Field-system integration', 'Portfolio forecasts'],
    measures: ['Cost variance', 'Schedule variance', 'RFI age', 'Change-order activity'],
  },
  {
    short: 'Operate',
    title: 'Construction Complete and In Service',
    purpose: 'Maintain continuity from the original need through infrastructure handoff and operating outcomes.',
    users: ['Closeout teams', 'Asset managers', 'Operations staff', 'Program leaders'],
    activities: ['Track substantial and final completion', 'Coordinate punch lists, inspections, and contract closeout', 'Manage asset handoff, as-builts, warranties, and benefit monitoring'],
    information: ['Final cost reconciliation', 'Handoff documents', 'Warranty records', 'In-service milestone and outcome measures'],
    decisions: ['Final acceptance workflow', 'Asset handoff confirmation', 'Post-delivery review'],
    dependencies: ['Final inspections', 'Authoritative asset system', 'Closeout documentation'],
    capabilities: ['Closeout workspace', 'Handoff checklist', 'Warranty tracking', 'Outcome links'],
    measures: ['Closeout readiness', 'Handoff completeness', 'In-service date', 'Benefit-measure availability'],
  },
]

const challenges = [
  { title: 'Fragmented project information', problem: 'Project, funding, schedule, contract, risk, and document information is distributed across systems and spreadsheets.', matters: 'Teams spend time reconciling records before they can assess portfolio conditions.', response: 'Create a connected portfolio view using standardized project records, integration services, shared milestones, and configurable dashboards.', measures: ['Record completeness', 'Integration health', 'Reporting latency', 'Manual reconciliation effort'] },
  { title: 'Programming disconnected from readiness', problem: 'Projects may enter a capital program before delivery dependencies are sufficiently visible.', matters: 'Funding, environmental, design, right-of-way, utility, and procurement conditions can affect obligation and delivery plans.', response: 'Connect prioritization and STIP programming decisions to readiness criteria, dependencies, funding constraints, and delivery forecasts.', measures: ['Readiness status', 'Obligation risk', 'Milestone confidence', 'Amendment activity'] },
  { title: 'Limited funding visibility', problem: 'Program managers struggle to connect programmed amounts, authorizations, obligations, commitments, expenditures, forecasts, and balances.', matters: 'Disconnected fiscal views make funding exposure and timing difficult to interpret.', response: 'Provide a common fiscal view across funding sources, fiscal years, projects, programs, and delivery stages.', measures: ['Obligation timeliness', 'Forecast variance', 'Expiring funds', 'Funding-gap exposure'] },
  { title: 'Risks identified too late', problem: 'Schedule, cost, procurement, supply-chain, utility, right-of-way, and contractor risks can surface after delivery is affected.', matters: 'Late visibility reduces the range of available mitigation choices.', response: 'Use configurable thresholds, alerts, dependencies, risk registers, and portfolio analytics to surface emerging conditions earlier.', measures: ['Open risks', 'Risk age', 'Milestone slippage', 'Forecast movement'] },
  { title: 'Manual handoffs and inconsistent workflows', problem: 'Reviews, approvals, documents, decisions, and handoffs vary across offices, districts, disciplines, and project teams.', matters: 'Variation can create unclear ownership, rework, and avoidable waiting.', response: 'Digitize common workflows while allowing the agency to configure roles, approvals, forms, milestones, and exceptions.', measures: ['Approval-cycle time', 'Overdue tasks', 'Rework', 'Workflow exceptions'] },
  { title: 'Limited executive program intelligence', problem: 'Leaders receive backward-looking reports assembled manually from multiple sources.', matters: 'Program choices may rely on stale or incomplete delivery context.', response: 'Provide role-based portfolio dashboards, alerts, forecasts, and scenario views connected to current program data.', measures: ['Portfolio health', 'Schedule confidence', 'Fiscal performance', 'Planned in-service dates'] },
]

const roles = [
  { name: 'Agency executives', icon: Building2, outcome: 'See where leadership attention is needed across the capital portfolio.', items: ['Portfolio health', 'Funding exposure', 'Projects at risk', 'Delivery forecasts', 'District comparisons', 'Expected in-service dates', 'Outcome visibility'] },
  { name: 'Capital-program leaders', icon: BriefcaseBusiness, outcome: 'Balance the project pipeline against readiness, fiscal constraints, and delivery dependencies.', items: ['Project pipeline', 'STIP and program status', 'Fiscal-year balancing', 'Dependencies', 'Readiness', 'Program risks', 'Amendments and decisions'] },
  { name: 'Project managers and engineers', icon: Route, outcome: 'Coordinate work and decisions around the next critical project milestones.', items: ['Milestones', 'Tasks', 'Reviews', 'Approvals', 'Issues', 'Design dependencies', 'Documents', 'Schedule and budget status'] },
  { name: 'Finance and funding teams', icon: CircleDollarSign, outcome: 'Trace funding position and timing from programming through expenditure.', items: ['Funding sources', 'Programmed amounts', 'Authorizations', 'Obligations', 'Commitments', 'Expenditures', 'Forecasts', 'Available balances'] },
  { name: 'Construction and field teams', icon: HardHat, outcome: 'Connect contract and field activity to program-level delivery status.', items: ['Contract milestones', 'Field issues', 'Change orders', 'RFIs', 'Submittals', 'Inspections', 'Materials', 'Punch lists'] },
  { name: 'District and regional teams', icon: Map, outcome: 'Manage local priorities and handoffs within the wider agency portfolio.', items: ['District portfolios', 'Candidate-project intake', 'Local priorities', 'Readiness', 'Project handoffs', 'Schedule and risk status'] },
  { name: 'Oversight and administrative users', icon: ShieldCheck, outcome: 'Review how decisions, access, data quality, and configuration are governed.', items: ['Decision history', 'Approvals', 'Audit records', 'Configuration', 'Data quality', 'Reporting', 'Access controls'] },
]

const capabilities = [
  ['Capital Portfolio and STIP Management', 'Project intake, candidate evaluation, prioritization, program development, STIP coordination, fiscal-year programming, amendments, scenario planning, and portfolio reporting.'],
  ['Funding and Fiscal Management', 'Multiple funding sources, programmed funding, authorizations, obligations, commitments, expenditures, forecasts, balances, fiscal controls, and funding-risk alerts.'],
  ['Project Controls', 'Master milestones, dependencies, budgets, schedules, risks, issues, decisions, changes, forecasts, and portfolio standards.'],
  ['Engineering and Project Development', 'Environmental workflow tracking, design reviews, permits, utilities, railroad coordination, right-of-way, engagement, approvals, and handoffs.'],
  ['Procurement and Contract Coordination', 'Procurement readiness, bid-package milestones, estimates, approvals, contractor information, notice-to-proceed readiness, and system integration.'],
  ['Construction Delivery', 'Schedules, costs, field issues, RFIs, submittals, change orders, materials, contractor performance, and closeout.'],
  ['GIS and Location Intelligence', 'Project locations, corridors, districts, assets, right-of-way, environmental information, construction activity, and geographic portfolio analysis.'],
  ['Executive Program Intelligence', 'Portfolio dashboards, alerts, trends, forecasts, scenario views, district comparisons, funding exposure, delivery confidence, and outcome tracking.'],
]

const projectRows = [
  ['North Corridor Safety Improvements', 'Project development', '$68.4M', 'On track', 'Oct 2028'],
  ['River Crossing Rehabilitation', 'Construction', '$126.0M', 'Watch', 'May 2027'],
  ['District 4 Pavement Renewal', 'Procurement', '$42.8M', 'On track', 'Aug 2027'],
  ['Central Interchange Modernization', 'Project development', '$94.2M', 'Attention', 'Mar 2029'],
  ['East County Mobility Program', 'Programming', '$57.5M', 'On track', 'Nov 2029'],
]

const commandTabs = ['Portfolio', 'Funding', 'Schedule', 'Risk', 'Construction', 'Map', 'Outcomes']
const tabDescriptions: Record<string, string> = {
  Portfolio: 'Portfolio status by lifecycle stage',
  Funding: 'Programmed and obligated funding profile',
  Schedule: 'Milestone confidence and upcoming decisions',
  Risk: 'Open delivery conditions by category',
  Construction: 'Change and field activity trends',
  Map: 'Geographic distribution of illustrative projects',
  Outcomes: 'In-service and asset-handoff readiness',
}

const scenarios = [
  { name: 'Delivery Readiness', note: 'Weights readiness, dependency resolution, and obligation timing.', scores: [92, 84, 76, 68, 60] },
  { name: 'Safety and Condition', note: 'Weights safety need, condition, and service impact.', scores: [78, 94, 88, 63, 72] },
  { name: 'Fiscal Balance', note: 'Weights funding fit, fiscal-year balance, and obligation windows.', scores: [70, 74, 82, 90, 86] },
]

const riskData = [
  { name: 'Funding', level: 2, milestone: 'Federal authorization', consequence: 'Obligation may move to a later fiscal period.', owner: 'Funding manager', mitigation: 'Alternative funding review in progress', dependency: 'Updated cost estimate', threshold: 'Escalate 90 days before deadline' },
  { name: 'Environmental', level: 3, milestone: 'Environmental decision', consequence: 'Final design start may shift.', owner: 'Environmental lead', mitigation: 'Agency comments under review', dependency: 'Specialist study', threshold: 'Escalate when review exceeds 30 days' },
  { name: 'Right-of-way', level: 4, milestone: 'Right-of-way certification', consequence: 'Bid package cannot advance as planned.', owner: 'ROW manager', mitigation: 'Priority parcels assigned', dependency: 'Appraisal completion', threshold: 'Escalate if critical parcel slips' },
  { name: 'Utilities', level: 4, milestone: 'Utility clearance', consequence: 'Construction sequencing may change.', owner: 'Utility coordinator', mitigation: 'Weekly coordination active', dependency: 'Relocation design', threshold: 'Escalate at 20-day float' },
  { name: 'Design', level: 2, milestone: '90% design review', consequence: 'Estimate validation may be delayed.', owner: 'Design manager', mitigation: 'Comment resolution scheduled', dependency: 'Drainage package', threshold: 'Escalate after two missed actions' },
  { name: 'Procurement', level: 3, milestone: 'Advertisement', consequence: 'Bid opening may move.', owner: 'Contracts lead', mitigation: 'Readiness checklist under review', dependency: 'Final estimate', threshold: 'Escalate 45 days before ad date' },
  { name: 'Supply chain', level: 3, milestone: 'Structural steel delivery', consequence: 'Critical-path work may be resequenced.', owner: 'Construction manager', mitigation: 'Fabrication status requested', dependency: 'Shop drawing approval', threshold: 'Escalate at 15-day forecast variance' },
  { name: 'Construction', level: 2, milestone: 'Traffic switch', consequence: 'Seasonal work window may narrow.', owner: 'Resident engineer', mitigation: 'Recovery sequence being reviewed', dependency: 'Barrier delivery', threshold: 'Escalate below 10 days float' },
  { name: 'Contractor performance', level: 3, milestone: 'Monthly production target', consequence: 'Forecast completion could move.', owner: 'Contract administrator', mitigation: 'Corrective plan requested', dependency: 'Crew availability', threshold: 'Escalate after two periods below plan' },
  { name: 'Schedule', level: 4, milestone: 'Substantial completion', consequence: 'In-service date is under pressure.', owner: 'Project manager', mitigation: 'Schedule workshop planned', dependency: 'Utility and supply-chain risks', threshold: 'Escalate at 30-day variance' },
  { name: 'Cost', level: 2, milestone: 'Estimate at completion', consequence: 'Program reserve may be needed.', owner: 'Project controls lead', mitigation: 'Forecast reconciliation active', dependency: 'Pending change estimate', threshold: 'Escalate above 5% variance' },
]

const roadmap = [
  ['Establish portfolio visibility', 'Standardize project information', 'Connect priority data sources', 'Create executive and program dashboards', 'Establish governance and data-quality rules'],
  ['Connect planning and programming', 'Project intake', 'Evaluation and prioritization', 'STIP and program workflows', 'Funding alignment'],
  ['Coordinate project development', 'Engineering milestones', 'Environmental activities', 'Right-of-way and utilities', 'Permitting and design reviews'],
  ['Strengthen construction delivery', 'Contract coordination', 'Construction milestones and costs', 'Changes and field issues', 'Materials and contractor performance'],
  ['Connect delivery to outcomes', 'Closeout', 'Asset handoff', 'In-service status', 'Benefit monitoring and program learning'],
]

const architectureSystems = ['ERP & finance', 'Scheduling', 'GIS & location', 'Asset management', 'Documents', 'Procurement', 'Construction systems', 'Identity & access', 'Data & reporting', 'Reporting interfaces', 'Partner portals']
const architectureLayers = ['Role-based experiences', 'Transportation workflows', 'Shared capital-program data', 'Integration & API services', 'Analytics & program intelligence', 'Security, governance & auditability']

const fundingByYear: Record<string, number[]> = {
  'FY 2027': [38, 12, 6, 9, 15],
  'FY 2028': [46, 14, 8, 12, 18],
  'FY 2029': [30, 10, 11, 15, 22],
}
const fundingNames = ['Federal', 'State match', 'Local', 'Grant', 'Bond']
const fundingColors = ['#177bb6', '#14a69a', '#e8a23a', '#6750a4', '#567082']

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
}

function DemoLabel() {
  return <span className="demo-label"><Activity size={13} /> Illustrative data for product demonstration</span>
}

function RoadMapGraphic() {
  return (
    <svg className="map-graphic" viewBox="0 0 460 250" role="img" aria-labelledby="map-title map-desc">
      <title id="map-title">Illustrative capital project map</title>
      <desc id="map-desc">A fictional highway network with five project markers in different delivery stages.</desc>
      <rect width="460" height="250" rx="16" fill="#eaf1f3" />
      <path d="M-10 62 C90 20 120 140 245 91 S390 58 480 25" fill="none" stroke="#cbd8dc" strokeWidth="18" />
      <path d="M-10 62 C90 20 120 140 245 91 S390 58 480 25" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="12 9" />
      <path d="M66 270 C75 190 180 208 205 138 S335 115 400 -15" fill="none" stroke="#cbd8dc" strokeWidth="14" />
      <path d="M66 270 C75 190 180 208 205 138 S335 115 400 -15" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="9 8" />
      <path d="M-15 198 C95 135 140 250 260 198 S380 155 475 210" fill="none" stroke="#98b5bc" strokeWidth="8" />
      {[[88,72,'1'],[203,132,'2'],[310,72,'3'],[355,175,'4'],[150,200,'5']].map(([x,y,n], i) => (
        <g key={String(n)} transform={`translate(${x} ${y})`}>
          <circle r="14" fill={i === 3 ? '#d97b27' : '#0b688f'} stroke="#fff" strokeWidth="3" />
          <text y="4" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">{n}</text>
        </g>
      ))}
    </svg>
  )
}

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('modal-open') }
  }, [open, onClose])
  if (!open) return null
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true) }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.currentTarget === e.target) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button ref={closeRef} className="icon-button modal-close" onClick={onClose} aria-label="Close request form"><X /></button>
        {!sent ? <>
          <span className="eyebrow">Product conversation</span>
          <h2 id={titleId}>Request a demonstration</h2>
          <p>Tell us what your agency would like to explore. This prototype keeps entries in your browser and does not transmit information.</p>
          <form onSubmit={submit}>
            <div className="form-grid">
              <label>Name<input name="name" required autoComplete="name" /></label>
              <label>Agency<input name="agency" required autoComplete="organization" /></label>
              <label>Role<input name="role" required autoComplete="organization-title" /></label>
              <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            </div>
            <label>Area of interest<select name="interest" defaultValue=""><option value="" disabled>Select an area</option><option>Portfolio visibility</option><option>STIP and funding</option><option>Project delivery</option><option>Modular adoption</option></select></label>
            <label>Message<textarea name="message" rows={4} placeholder="What would be useful to discuss?" /></label>
            <button className="button primary" type="submit">Save prototype request <ArrowRight size={17} /></button>
          </form>
        </> : <div className="confirmation" role="status"><span className="success-icon"><Check /></span><h2 id={titleId}>Request saved locally</h2><p>No information was transmitted. Connect this form to an approved agency contact workflow before publication.</p><button className="button primary" onClick={onClose}>Close</button></div>}
      </div>
    </div>
  )
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [challenge, setChallenge] = useState(0)
  const [stage, setStage] = useState(0)
  const [role, setRole] = useState(0)
  const [capability, setCapability] = useState(0)
  const [commandTab, setCommandTab] = useState('Portfolio')
  const [scenario, setScenario] = useState(0)
  const [fundingYear, setFundingYear] = useState('FY 2027')
  const [fundingSource, setFundingSource] = useState('Combined')
  const [risk, setRisk] = useState(2)
  const [archSystem, setArchSystem] = useState(0)
  const [agencyType, setAgencyType] = useState('State DOT')
  const [objective, setObjective] = useState('Portfolio visibility')
  const [phase, setPhase] = useState('Foundation')
  const [roadmapPhase, setRoadmapPhase] = useState(0)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openModal = () => setModalOpen(true)
  const tabKeys = (event: KeyboardEvent, current: number, length: number, setter: (value: number) => void) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    setter((current + (event.key === 'ArrowRight' ? 1 : -1) + length) % length)
  }
  const selectedStage = lifecycle[stage]
  const selectedRisk = riskData[risk]
  const yearValues = fundingByYear[fundingYear]
  const totalFunding = yearValues.reduce((sum, value) => sum + value, 0)
  const filteredFunding = fundingSource === 'Combined' ? totalFunding : yearValues[fundingNames.indexOf(fundingSource)]
  const configRecommendations = [
    agencyType === 'Toll authority' ? 'Corridor and toll-asset portfolio' : agencyType === 'Regional agency' ? 'Regional program and partner views' : 'District and statewide portfolio views',
    objective === 'Funding coordination' ? 'Funding ledger and obligation alerts' : objective === 'Construction delivery' ? 'Contract milestones and field-system connections' : 'Executive portfolio and readiness dashboards',
    phase === 'Pilot' ? 'Focused workflow pilot with selected integrations' : phase === 'Expansion' ? 'Additional lifecycle modules and districts' : 'Shared data model and governance foundation',
  ]

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <a href="#overview" className="brand" aria-label="MTX GOV Highway Administration Hub home">
          <span className="brand-mark"><Route /></span>
          <span><b>MTX GOV</b><small>Highway Administration Hub</small></span>
        </a>
        <button className="mobile-toggle icon-button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="main-nav" aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button>
        <nav id="main-nav" className={mobileOpen ? 'open' : ''} aria-label="Primary navigation">
          {['Overview', 'Challenges', 'Lifecycle', 'Capabilities', 'Program Intelligence', 'Architecture', 'Adoption'].map((item) => <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setMobileOpen(false)}>{item}</a>)}
          <button className="button primary nav-cta" onClick={openModal}>Request a Demo</button>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="overview">
          <div className="hero-copy">
            <span className="eyebrow light">Connected Transportation Capital Delivery</span>
            <h1>Plan. Fund.<br />Deliver. <em>Operate.</em></h1>
            <p className="hero-lead">Bring projects, programs, funding, schedules, risks, contracts, and delivery performance into one connected view—from initial transportation need through construction and in-service operations.</p>
            <p>MTX GOV Highway Administration Hub provides transportation agencies with a configurable capital-program coordination and intelligence layer. It connects lifecycle workflows and information without requiring the agency to replace every underlying system.</p>
            <div className="hero-actions">
              <a className="button primary bright" href="#lifecycle">Explore the Capital Lifecycle <ArrowRight size={17} /></a>
              <a className="button secondary light-button" href="#program-intelligence">View the Program Command Center</a>
              <button className="text-link light-link" onClick={openModal}>Request a Product Demonstration</button>
            </div>
          </div>
          <div className="hero-dashboard">
            <div className="interface-label">Illustrative product view</div>
            <div className="dash-top"><div><small>ACTIVE CAPITAL PORTFOLIO</small><strong>38 projects</strong></div><span className="status-chip"><Activity size={14} /> Portfolio current</span></div>
            <div className="metric-row">
              <div><span>Programmed funding</span><b>$2.48B</b><small>Illustrative</small></div>
              <div><span>Obligation milestones</span><b>12</b><small>Next 120 days</small></div>
              <div><span>Projects at risk</span><b className="amber">6</b><small>Review needed</small></div>
              <div><span>Entering service</span><b>4</b><small>Next 12 months</small></div>
            </div>
            <div className="dash-grid">
              <div className="mini-chart card-inset">
                <div className="mini-head"><span>Cost & schedule indicators</span><small>Portfolio</small></div>
                {[['Cost confidence',82],['Schedule confidence',74],['Readiness',88]].map(([name, value]) => <div className="progress-line" key={String(name)}><span>{name}</span><div><i style={{ width: `${value}%` }} /></div><b>{value}%</b></div>)}
              </div>
              <RoadMapGraphic />
            </div>
            <DemoLabel />
          </div>
        </section>

        <section className="scope-strip" aria-label="Product scope">
          <span className="scope-title">Product scope</span>
          <div><b>7</b><span>Connected lifecycle stages</span></div>
          <div><b>8</b><span>Core capability families</span></div>
          <div><b>1</b><span>Shared capital-program view</span></div>
          <div><b className="word">Modular</b><span>Adoption model</span></div>
        </section>

        <section className="section challenges-section" id="challenges">
          <SectionHeading eyebrow="From fragmented records to connected decisions" title="Turn capital-program complexity into a working portfolio view." copy="Select a common agency challenge to see how the Hub can support a response and what operational measures teams could monitor." />
          <div className="selector-layout">
            <div className="challenge-list" role="tablist" aria-label="Industry challenges">
              {challenges.map((item, index) => <button key={item.title} role="tab" aria-selected={challenge === index} className={challenge === index ? 'active' : ''} onClick={() => setChallenge(index)} onKeyDown={(e) => tabKeys(e, challenge, challenges.length, setChallenge)}><span>{String(index + 1).padStart(2, '0')}</span>{item.title}<ArrowRight size={16} /></button>)}
            </div>
            <div className="challenge-detail" role="tabpanel">
              <div className="detail-kicker"><AlertTriangle size={18} /> Industry condition</div>
              <h3>{challenges[challenge].title}</h3>
              <p>{challenges[challenge].problem}</p>
              <div className="why-box"><b>Why it matters</b><p>{challenges[challenge].matters}</p></div>
              <div className="response-box"><span>HUB RESPONSE</span><p>{challenges[challenge].response}</p></div>
              <h4>Operational measures to monitor</h4>
              <div className="chip-row">{challenges[challenge].measures.map((measure) => <span className="chip" key={measure}>{measure}</span>)}</div>
            </div>
          </div>
        </section>

        <section className="section lifecycle-section" id="lifecycle">
          <SectionHeading eyebrow="Seven connected stages" title="A continuous digital record across the capital lifecycle." copy="The Hub connects work and decisions while authoritative engineering, financial, procurement, GIS, and asset systems retain their respective roles." />
          <div className="lifecycle-nav" role="tablist" aria-label="Capital lifecycle stages">
            {lifecycle.map((item, index) => <button role="tab" aria-selected={stage === index} className={stage === index ? 'active' : ''} key={item.short} onClick={() => setStage(index)} onKeyDown={(e) => tabKeys(e, stage, lifecycle.length, setStage)}><span>{index + 1}</span><b>{item.short}</b></button>)}
          </div>
          <div className="stage-panel" role="tabpanel">
            <div className="stage-summary"><span className="stage-number">0{stage + 1}</span><div><span className="eyebrow">{selectedStage.short}</span><h3>{selectedStage.title}</h3><p>{selectedStage.purpose}</p><h4>Primary users</h4><div className="chip-row">{selectedStage.users.map((x) => <span className="chip" key={x}>{x}</span>)}</div></div></div>
            <div className="stage-grid">
              {[['Major activities', selectedStage.activities], ['Information managed', selectedStage.information], ['Key decisions', selectedStage.decisions], ['Important dependencies', selectedStage.dependencies], ['Product capabilities', selectedStage.capabilities], ['Suggested measures', selectedStage.measures]].map(([title, items]) => <div className="info-group" key={title as string}><h4>{title as string}</h4><ul>{(items as string[]).map((x) => <li key={x}><Check size={14} />{x}</li>)}</ul></div>)}
            </div>
          </div>
        </section>

        <section className="section command-section" id="program-intelligence">
          <SectionHeading eyebrow="Program command center" title="One Capital Program. One View." copy="Move from portfolio conditions to fiscal, schedule, risk, construction, location, and outcome details without rebuilding the report." />
          <div className="command-shell">
            <div className="command-header"><div className="command-brand"><span><BarChart3 /></span><div><b>Capital Program Command Center</b><small>Illustrative agency workspace</small></div></div><DemoLabel /></div>
            <div className="command-tabs" role="tablist" aria-label="Command center views">
              {commandTabs.map((tab) => <button role="tab" aria-selected={commandTab === tab} className={commandTab === tab ? 'active' : ''} key={tab} onClick={() => setCommandTab(tab)}>{tab}</button>)}
            </div>
            <div className="command-body" role="tabpanel">
              <div className="command-title"><div><span>SELECTED VIEW</span><h3>{tabDescriptions[commandTab]}</h3></div><span className="updated"><Clock3 size={14} /> Sample refresh 08:30</span></div>
              {commandTab === 'Map' ? <div className="large-map"><RoadMapGraphic /><div className="map-legend">{projectRows.map((row, i) => <span key={row[0]}><i>{i + 1}</i>{row[0]}</span>)}</div></div> :
                commandTab === 'Funding' ? <ChartPanel type="funding" /> :
                commandTab === 'Schedule' ? <ChartPanel type="schedule" /> :
                commandTab === 'Risk' ? <ChartPanel type="risk" /> :
                commandTab === 'Construction' ? <ChartPanel type="construction" /> :
                commandTab === 'Outcomes' ? <ChartPanel type="outcomes" /> :
                <><div className="command-metrics"><div><span>Portfolio health</span><b>76%</b><small>29 on track / 9 review</small></div><div><span>Programmed</span><b>$2.48B</b><small>Across sample portfolio</small></div><div><span>Next milestone</span><b>Sep 18</b><small>Funding authorization</small></div><div><span>In-service forecast</span><b>4</b><small>Next 12 months</small></div></div><ChartPanel type="portfolio" /></>}
              <div className="project-table-wrap"><table><caption className="sr-only">Illustrative project portfolio</caption><thead><tr>{['Project', 'Lifecycle stage', 'Programmed', 'Status', 'In service'].map((x) => <th key={x}>{x}</th>)}</tr></thead><tbody>{projectRows.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={cell} data-label={['Project', 'Stage', 'Programmed', 'Status', 'In service'][i]}>{i === 3 ? <span className={`table-status ${cell.toLowerCase().replace(' ', '-')}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div>
              <DemoLabel />
            </div>
          </div>
        </section>

        <section className="section roles-section">
          <SectionHeading eyebrow="Role-based experiences" title="Give each team a useful view of the same program." copy="Experiences focus attention on the work, decisions, and conditions relevant to each role." />
          <div className="role-layout">
            <div className="role-tabs" role="tablist" aria-label="Agency roles">{roles.map((item, index) => { const Icon = item.icon; return <button role="tab" aria-selected={role === index} className={role === index ? 'active' : ''} onClick={() => setRole(index)} key={item.name}><Icon size={18} />{item.name}<ArrowRight size={15} /></button> })}</div>
            <div className="role-panel" role="tabpanel">
              <div className="role-icon">{(() => { const Icon = roles[role].icon; return <Icon /> })()}</div>
              <span className="eyebrow">Workspace outcome</span><h3>{roles[role].name}</h3><p className="large-copy">{roles[role].outcome}</p>
              <div className="role-items">{roles[role].items.map((x) => <div key={x}><Check size={15} />{x}</div>)}</div>
            </div>
          </div>
        </section>

        <section className="section capabilities-section" id="capabilities">
          <SectionHeading eyebrow="Reusable product capabilities" title="Configure the Hub around agency priorities." copy="Select a capability family to explore the supporting product patterns." />
          <div className="capability-grid">
            {capabilities.map(([title, copy], index) => <button className={capability === index ? 'capability-card active' : 'capability-card'} onClick={() => setCapability(index)} key={title} aria-pressed={capability === index}><span className="cap-number">0{index + 1}</span><h3>{title}</h3><p>{copy}</p><span className="explore">Explore capability <ArrowRight size={16} /></span></button>)}
          </div>
          <div className="capability-callout" role="status"><Settings2 /><div><span>SELECTED CAPABILITY</span><b>{capabilities[capability][0]}</b></div><p>{capabilities[capability][1]}</p></div>
        </section>

        <section className="section stip-section">
          <SectionHeading eyebrow="STIP and funding programming" title="Connect planning choices to delivery conditions." copy="Support agency STIP development and coordination with a traceable flow from transportation need through infrastructure in service." />
          <div className="program-flow" aria-label="Programming lifecycle flow">{['Transportation need', 'Candidate project', 'Prioritization', 'Program selection', 'Funding assignment', 'STIP programming', 'Authorization & obligation', 'Project delivery', 'In-service outcome'].map((x, i) => <div key={x}><span>{i + 1}</span><b>{x}</b>{i < 8 && <ArrowRight />}</div>)}</div>
          <div className="scenario-shell">
            <div className="scenario-copy"><span className="eyebrow">Illustrative scenario comparison</span><h3>Organize priorities through different agency lenses.</h3><p>{scenarios[scenario].note}</p><div className="scenario-buttons" role="tablist">{scenarios.map((x, i) => <button role="tab" aria-selected={scenario === i} className={scenario === i ? 'active' : ''} key={x.name} onClick={() => setScenario(i)}>{x.name}</button>)}</div><blockquote>Scenario tools organize information and support agency decision-making. Final investment, programming, and funding decisions remain with authorized agency officials and established planning processes.</blockquote></div>
            <div className="scenario-chart"><DemoLabel /><ResponsiveContainer width="100%" height={310}><BarChart layout="vertical" data={projectRows.map((row, i) => ({ name: row[0].split(' ').slice(0, 2).join(' '), score: scenarios[scenario].scores[i] }))} margin={{ left: 25, right: 25 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" domain={[0, 100]} /><YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} /><Tooltip formatter={(value) => [`${value} / 100`, 'Illustrative score']} /><Bar dataKey="score" fill="#147dad" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
        </section>

        <section className="section funding-section">
          <SectionHeading eyebrow="Funding and fiscal control" title="Trace funding position without displacing the agency ledger." copy="Connect programmed, authorized, obligated, committed, expended, and forecast amounts while financial transactions remain governed by the agency’s authoritative ERP or financial system." />
          <div className="funding-shell">
            <div className="funding-controls"><div><label htmlFor="year">Fiscal year</label><select id="year" value={fundingYear} onChange={(e) => setFundingYear(e.target.value)}>{Object.keys(fundingByYear).map((x) => <option key={x}>{x}</option>)}</select></div><div><label htmlFor="source">Funding source</label><select id="source" value={fundingSource} onChange={(e) => setFundingSource(e.target.value)}><option>Combined</option>{fundingNames.map((x) => <option key={x}>{x}</option>)}</select></div><DemoLabel /></div>
            <div className="funding-content">
              <div className="funding-donut"><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={fundingNames.map((name, i) => ({ name, value: yearValues[i] }))} dataKey="value" innerRadius={68} outerRadius={100} paddingAngle={2}>{fundingColors.map((color) => <Cell key={color} fill={color} />)}</Pie><Tooltip formatter={(value) => [`$${value}M`, 'Illustrative amount']} /></PieChart></ResponsiveContainer><div className="donut-center"><span>{fundingSource}</span><b>${filteredFunding}M</b><small>{fundingYear}</small></div></div>
              <div className="funding-legend">{fundingNames.map((name, i) => <button key={name} onClick={() => setFundingSource(name)} className={fundingSource === name ? 'active' : ''}><i style={{ background: fundingColors[i] }} /><span>{name}</span><b>${yearValues[i]}M</b></button>)}</div>
              <div className="ledger"><h3>Illustrative project funding ledger</h3>{[['Programmed', totalFunding], ['Authorized', totalFunding * .91], ['Obligated', totalFunding * .78], ['Committed', totalFunding * .63], ['Expended', totalFunding * .42], ['Current forecast', totalFunding * .96], ['Remaining balance', totalFunding * .58]].map(([name, value]) => <div className="ledger-row" key={name as string}><span>{name}</span><div><i style={{ width: `${Math.min(100, Number(value) / totalFunding * 100)}%` }} /></div><b>${Number(value).toFixed(1)}M</b></div>)}</div>
            </div>
          </div>
        </section>

        <section className="section risk-section">
          <SectionHeading eyebrow="Risk and delivery intelligence" title="See delivery risk before it becomes delay." copy="Use pattern detection, configurable alerts, forecast support, and human-reviewed recommendations to identify emerging portfolio conditions." />
          <div className="risk-layout">
            <div className="risk-matrix" aria-label="Interactive portfolio risk matrix">{riskData.map((item, i) => <button className={`risk-cell level-${item.level} ${risk === i ? 'active' : ''}`} onClick={() => setRisk(i)} key={item.name} aria-pressed={risk === i}><span>{item.name}</span><b>{['Low', 'Monitor', 'Elevated', 'High'][item.level - 1]}</b></button>)}</div>
            <div className="risk-detail">
              <span className={`risk-badge level-${selectedRisk.level}`}><AlertTriangle size={15} /> {['Low', 'Monitor', 'Elevated', 'High'][selectedRisk.level - 1]} indicator</span>
              <h3>{selectedRisk.name}</h3>
              {[['Affected milestone', selectedRisk.milestone], ['Potential consequence', selectedRisk.consequence], ['Owner', selectedRisk.owner], ['Mitigation status', selectedRisk.mitigation], ['Related dependency', selectedRisk.dependency], ['Escalation threshold', selectedRisk.threshold]].map(([label, value]) => <div className="risk-row" key={label}><span>{label}</span><b>{value}</b></div>)}
              <DemoLabel />
            </div>
          </div>
        </section>

        <section className="section architecture-section" id="architecture">
          <SectionHeading eyebrow="Integration and enterprise architecture" title="A coordination layer across the transportation technology environment." copy="Connect systems through API-first integration, configurable data exchange, and standards-based interfaces without assuming instant compatibility or unnecessary replacement." />
          <div className="architecture">
            <div className="system-ring" aria-label="Connected enterprise systems">{architectureSystems.map((item, i) => <button className={archSystem === i ? 'active' : ''} onClick={() => setArchSystem(i)} key={item}><Database size={15} />{item}</button>)}</div>
            <div className="hub-core"><span><Network /></span><small>COORDINATION & INTELLIGENCE LAYER</small><h3>MTX GOV Highway Administration Hub</h3><p>Selected connection: <b>{architectureSystems[archSystem]}</b></p><div className="core-layers">{architectureLayers.map((x, i) => <div key={x}><span>{i + 1}</span>{x}</div>)}</div></div>
          </div>
          <div className="architecture-principles">{['API-first integration', 'Configurable exchange', 'Role-based access', 'Audit history', 'Data-quality monitoring', 'State ownership of authoritative data', 'Modular integration', 'Replaceable components'].map((x) => <span key={x}><Check size={14} />{x}</span>)}</div>
        </section>

        <section className="section config-section">
          <SectionHeading eyebrow="Product configurability" title="Adapt the product to the agency operating model." copy="Configure project types, stage gates, milestones, readiness criteria, scoring models, funding programs, fiscal years, approval chains, risks, forms, roles, dashboards, structures, documents, and reporting views." />
          <div className="config-demo">
            <div className="config-controls">
              <span className="eyebrow">Illustrative product experience</span>
              <label>Agency type<select value={agencyType} onChange={(e) => setAgencyType(e.target.value)}><option>State DOT</option><option>Regional agency</option><option>Toll authority</option></select></label>
              <label>Primary program objective<select value={objective} onChange={(e) => setObjective(e.target.value)}><option>Portfolio visibility</option><option>Funding coordination</option><option>Construction delivery</option></select></label>
              <label>Deployment phase<select value={phase} onChange={(e) => setPhase(e.target.value)}><option>Foundation</option><option>Pilot</option><option>Expansion</option></select></label>
            </div>
            <div className="config-result">
              <span>ILLUSTRATIVE CONFIGURATION</span><h3>{agencyType} · {objective}</h3><p>A sample starting point based on the selections—not a binding implementation recommendation.</p>
              {configRecommendations.map((x, i) => <div key={x}><span>0{i + 1}</span><b>{x}</b><Check /></div>)}
              <small>Configuration scope would be validated through agency discovery, governance, architecture, and procurement processes.</small>
            </div>
          </div>
        </section>

        <section className="section adoption-section" id="adoption">
          <SectionHeading eyebrow="Modular adoption roadmap" title="Modernize in practical, connected increments." copy="Agencies may sequence modules according to current systems, business priorities, data readiness, and procurement strategy." />
          <div className="roadmap-tabs" role="tablist" aria-label="Adoption roadmap phases">{roadmap.map((item, i) => <button role="tab" aria-selected={roadmapPhase === i} className={roadmapPhase === i ? 'active' : ''} onClick={() => setRoadmapPhase(i)} key={item[0]}><span>Phase {i + 1}</span><b>{item[0]}</b></button>)}</div>
          <div className="roadmap-panel" role="tabpanel"><div><span className="phase-marker">0{roadmapPhase + 1}</span><span className="eyebrow">Selected adoption phase</span><h3>{roadmap[roadmapPhase][0]}</h3></div><ul>{roadmap[roadmapPhase].slice(1).map((x) => <li key={x}><Check />{x}</li>)}</ul></div>
        </section>

        <section className="section operating-model-section">
          <SectionHeading eyebrow="Clear commercial model" title="Product, implementation, and support—distinct by design." />
          <div className="model-grid">
            {[
              ['Product subscription', Layers3, 'Reusable product foundation', ['Transportation-specific data model', 'Configurable capital lifecycle', 'Reusable workflow patterns', 'Portfolio dashboards and role-based experiences', 'Funding and milestone structures', 'Integration patterns and documentation', 'Product releases and enhancements']],
              ['Implementation services', GitBranch, 'Agency-specific delivery work', ['Discovery and operating-model alignment', 'Configuration and integration', 'Data migration and reporting', 'Testing and training', 'Deployment and change management', 'Knowledge transfer']],
              ['Managed services', Activity, 'Ongoing operational support', ['Production support and monitoring', 'Release management', 'Data-quality and reporting support', 'Integration monitoring', 'Enhancement delivery', 'Continuous optimization']],
            ].map(([title, Icon, subtitle, items]) => { const ModelIcon = Icon as typeof Layers3; return <div className="model-card" key={title as string}><ModelIcon /><span>{subtitle as string}</span><h3>{title as string}</h3><ul>{(items as string[]).map((x) => <li key={x}><Check size={14} />{x}</li>)}</ul></div> })}
          </div>
        </section>

        <section className="experience-band">
          <div><span className="eyebrow light">Experience informing the product</span><h2>Transportation experience informing the product</h2></div>
          <p>MTX’s transportation experience includes public-sector workflow modernization, digital permitting, constituent and customer service, partner portals, project and initiative tracking, GIS-enabled experiences, document integration, payment integration, reporting, and cross-system data coordination. These delivery patterns inform the reusable capabilities and implementation approach behind MTX GOV Highway Administration Hub.</p>
        </section>

        <section className="section measures-section">
          <SectionHeading eyebrow="Recommended agency measures" title="Measure what matters across the capital lifecycle." copy="These are measures the product can help an agency monitor. They are not claimed MTX results." />
          <div className="measure-grid">
            {[
              ['Planning and programming', ['Candidate-project volume', 'Readiness status', 'Programming decisions', 'STIP amendment activity', 'Funding eligibility', 'Upcoming obligation deadlines']],
              ['Fiscal performance', ['Programmed versus obligated funding', 'Commitments and expenditures', 'Forecast variance', 'Expiring funds', 'Available balance', 'Funding-gap exposure']],
              ['Project delivery', ['Milestone performance', 'Schedule variance', 'Cost variance', 'Dependency status', 'Risk age', 'Decision and approval time']],
              ['Construction', ['Change-order activity', 'RFI and submittal turnaround', 'Contractor performance', 'Field-issue age', 'Punch-list status', 'Closeout readiness']],
              ['In-service outcomes', ['Planned versus actual in-service date', 'Asset-handoff completeness', 'Warranty status', 'Benefit-measure availability', 'Post-delivery performance reviews']],
            ].map(([title, items], i) => <div key={title as string}><span>0{i + 1}</span><h3>{title as string}</h3><ul>{(items as string[]).map((x) => <li key={x}>{x}</li>)}</ul></div>)}
          </div>
        </section>

        <section className="section why-section">
          <SectionHeading eyebrow="Why the Hub" title="A product approach shaped for capital delivery." />
          <div className="why-grid">
            {[
              ['Built around the capital lifecycle', Route, 'Connect planning, programming, project development, construction, closeout, and in-service performance.'],
              ['A coordination layer—not a forced replacement strategy', Network, 'Improve enterprise visibility while allowing agencies to retain valuable authoritative systems.'],
              ['Configurable to the agency', Settings2, 'Adapt stages, funding models, approvals, milestones, risks, roles, and reporting to the operating model.'],
              ['Designed for modular modernization', Layers3, 'Begin with portfolio intelligence or a priority workflow and add capabilities as business readiness and funding allow.'],
            ].map(([title, Icon, copy]) => { const WhyIcon = Icon as typeof Route; return <div key={title as string}><WhyIcon /><h3>{title as string}</h3><p>{copy as string}</p></div> })}
          </div>
        </section>

        <section className="closing-cta">
          <div><span className="eyebrow light">Start with the program need</span><h2>Connect capital plans to projects delivered and infrastructure in service.</h2><p>See how MTX GOV Highway Administration Hub can create a shared portfolio view, strengthen fiscal and delivery visibility, and connect workflows across the transportation capital lifecycle.</p></div>
          <div className="closing-actions"><button className="button primary bright" onClick={openModal}>Request a Demonstration <ArrowRight size={17} /></button><button className="button secondary light-button" onClick={openModal}>Schedule a Capital Program Workshop</button><button className="text-link light-link" onClick={openModal}>Discuss a Modular Adoption Roadmap</button></div>
        </section>
      </main>

      <footer><div className="footer-brand"><span className="brand-mark"><Route /></span><div><b>MTX GOV</b><span>Highway Administration Hub</span></div></div><p>A configurable capital-program coordination and intelligence product for transportation agencies.</p><nav aria-label="Footer navigation"><a href="#overview">Overview</a><a href="#architecture">Architecture</a><a href="#adoption">Adoption</a><button onClick={openModal}>Request a demo</button></nav><small>Prototype experience. Displayed projects, maps, schedules, risks, and financial values are fictional and illustrative.</small></footer>
      <button className={`back-top ${showTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ChevronDown /></button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

function ChartPanel({ type }: { type: string }) {
  const data: Array<Record<string, string | number>> = type === 'portfolio' ? lifecycle.map((x, i) => ({ name: x.short, value: [5, 4, 6, 8, 4, 7, 4][i] })) :
    type === 'funding' ? ['FY27', 'FY28', 'FY29', 'FY30', 'FY31'].map((name, i) => ({ name, programmed: [420, 510, 560, 530, 460][i], obligated: [370, 428, 445, 390, 310][i] })) :
    type === 'schedule' ? ['Intake', 'Program', 'Develop', 'Procure', 'Construct'].map((name, i) => ({ name, value: [92, 84, 76, 81, 69][i] })) :
    type === 'risk' ? ['Funding', 'ROW', 'Utilities', 'Design', 'Contract'].map((name, i) => ({ name, value: [4, 7, 8, 5, 6][i] })) :
    type === 'construction' ? ['Apr', 'May', 'Jun', 'Jul', 'Aug'].map((name, i) => ({ name, changes: [4, 6, 5, 8, 6][i], field: [10, 8, 11, 7, 5][i] })) :
    ['Q1', 'Q2', 'Q3', 'Q4'].map((name, i) => ({ name, service: [1, 2, 3, 4][i], handoff: [58, 66, 79, 88][i] }))
  const isLine = type === 'construction' || type === 'outcomes'
  return (
    <div className="chart-panel" aria-label={`${type} illustrative chart`}>
      <ResponsiveContainer width="100%" height={260}>
        {isLine ? <LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey={type === 'outcomes' ? 'handoff' : 'changes'} stroke="#147dad" strokeWidth={3} /><Line type="monotone" dataKey={type === 'outcomes' ? 'service' : 'field'} stroke="#d97b27" strokeWidth={3} /></LineChart> :
          <BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey={type === 'funding' ? 'programmed' : 'value'} fill="#147dad" radius={[5, 5, 0, 0]} />{type === 'funding' && <Bar dataKey="obligated" fill="#1aa397" radius={[5, 5, 0, 0]} />}</BarChart>}
      </ResponsiveContainer>
    </div>
  )
}

export default App
