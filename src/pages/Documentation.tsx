import { useMemo } from 'react'
import { moduleCatalog } from '../modules/core/moduleCatalog'
import { architectureLayers } from '../modules/overview/architectureLayers'
import { objectivePoints } from '../modules/overview/objectivePoints'
import { problemPoints } from '../modules/overview/problemPoints'
import { moduleRelations } from '../modules/relationships/moduleRelations'
import { roleCards } from '../modules/roles/roleCards'
import { roadmap } from '../modules/roadmap/roadmap'

function DocumentationPage() {
  const pageSubtitle = useMemo(
    () => 'Smart Campus Service & Maintenance Management System for Gautam Buddha University',
    [],
  )

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Gautam Buddha University
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">{pageSubtitle}</h1>
            <p className="mt-3 max-w-3xl text-[var(--text-secondary)]">
              A centralized digital platform inspired by service aggregation workflows to improve
              maintenance efficiency, transparency, accountability, and continuous quality
              improvement across a distributed campus.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Problem Statement</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              {problemPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[rgb(var(--color-danger))]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Objectives</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              {objectivePoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[rgb(var(--color-success))]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold">System Architecture</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Layered, modular, and scalable architecture with clear responsibilities across UI,
            business logic, integrations, data management, and security.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {architectureLayers.map((layer) => (
              <article
                key={layer.title}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4"
              >
                <h3 className="font-semibold">{layer.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{layer.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold">Core Modules (Separate but Connected)</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Each module is independently designed for ownership and scalability, while data contracts
            and workflow events keep all modules interconnected.
          </p>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {moduleCatalog.map((module) => (
              <article
                key={module.name}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-5"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{module.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-primary))]">
                    Owner: {module.owner}
                  </p>
                </div>

                <p className="mt-3 text-sm text-[var(--text-secondary)]">{module.purpose}</p>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Sub-Modules</h4>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                    {module.subModules.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold">Capabilities</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.capabilities.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Inputs</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.inputs.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>

                    <h4 className="mt-3 text-sm font-semibold">Outputs</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.outputs.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold">Workflows</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.workflows.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>

                    <h4 className="mt-3 text-sm font-semibold">Automations</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.automations.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Validation Rules</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.validations.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>

                    <h4 className="mt-3 text-sm font-semibold">KPIs (Key Performance Indicators)</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.kpis.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Related Modules</h4>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                    {module.relatedModules.map((related) => (
                      <li key={related}>• {related}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold">Integrations</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.integrations.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold">Future Enhancements</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                      {module.futureEnhancements.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold">Inter-Module Relationship Flow</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
            {moduleRelations.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[rgb(var(--color-primary))]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold">Role-Based Dashboards</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Professionally structured role dashboards combining execution actions, governance controls,
            analytics visibility, and automation support for efficient service operations.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roleCards.map((role) => (
              <article
                key={role.title}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4"
              >
                <h3 className="font-semibold">{role.title}</h3>
                <h4 className="mt-3 text-sm font-semibold">Core Actions</h4>
                <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                  {role.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <h4 className="mt-3 text-sm font-semibold">Operational Controls</h4>
                <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                  {role.operationalControls.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <h4 className="mt-3 text-sm font-semibold">Insights & Reports</h4>
                <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                  {role.insightsReports.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <h4 className="mt-3 text-sm font-semibold">Automation Support</h4>
                <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                  {role.automations.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {roadmap.map((step) => (
            <article
              key={step.phase}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-primary))]">
                {step.phase}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{step.detail}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

export default DocumentationPage
