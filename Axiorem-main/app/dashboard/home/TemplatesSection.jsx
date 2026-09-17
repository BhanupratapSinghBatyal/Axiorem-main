// app/dashboard/home/TemplatesSection.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TEMPLATES = [
  { id: 'safety-manuals', title: 'OSHA / Safety Manuals', src: '/get-started-templates/safety-manuals.png', alt: 'Safety Manuals Template', description: 'Distills lengthy federal safety guidelines and dense compliance handbooks into clear, actionable daily field checklists.' },
  { id: 'industry-audits', title: 'Industry Audits & Operational Frameworks', src: '/get-started-templates/industry-audits.png', alt: 'Industry Audits Template', description: 'Converts ISO standards, operational audit documentation, and internal SOPs into structured compliance training, audit preparation guides, and assessment workflows.' },
  { id: 'engineering-blueprints', title: 'Technical Product Specs & Engineering Blueprints', src: '/get-started-templates/engineering-blueprints.png', alt: 'Engineering Blueprints Template', description: 'Translates deeply technical manufacturing data, complex software code logic, and heavy equipment manuals into clear, step-by-step guides.' },
  { id: 'employee-handbooks', title: 'Employee Handbooks & Conduct Guidelines', src: '/get-started-templates/employee-handbooks.png', alt: 'Employee Handbooks Template', description: 'Converts complex internal policies regarding information security, workplace conduct, and operational protocols into comprehensive presentation decks.' },
  { id: 'commercial-contracts', title: 'M&A Term Sheets & Commercial Contracts', src: '/get-started-templates/commercial-contracts.png', alt: 'Commercial Contracts Template', description: 'Transforms commercial agreements, procurement contracts, and M&A documentation into executive briefings, obligation summaries, approval workflows, and compliance learning modules.' },
  { id: 'api-docs', title: 'Complex FinTech API Documentation', src: '/get-started-templates/api-docs.png', alt: 'API Docs Template', description: 'Transforms financial API documentation, integration specifications, authentication flows, and webhook references into interactive developer onboarding, implementation guides, and integration training.' },
  { id: 'growth-reports', title: 'Quarterly Strategic Growth Reports', src: '/get-started-templates/growth-reports.png', alt: 'Growth Reports Template', description: 'Transforms quarterly business reports, revenue metrics, product updates, and operational KPIs into executive business reviews, performance briefings, and strategic decision presentations.' },
  { id: 'esg-initiatives', title: 'ESG Initiatives', src: '/get-started-templates/esg-initiatives.png', alt: 'ESG Initiatives Template', description: 'Transforms sustainability reports, ESG disclosures, environmental audits, and corporate governance documentation into executive sustainability briefings, policy training, and stakeholder-ready presentations.' },
  { id: 'hipaa-updates', title: 'Annual HIPAA Policy Updates', src: '/get-started-templates/hipaa-updates.png', alt: 'HIPAA Updates Template', description: 'Transforms HIPAA policies, patient privacy procedures, security standards, and regulatory updates into interactive compliance training, role-based learning, and healthcare privacy assessments.' },
  { id: 'supply-chain', title: 'Global Supply Chain Procedures', src: '/get-started-templates/supply-chain.png', alt: 'Supply Chain Template', description: 'Transforms procurement procedures, logistics documentation, supplier standards, and global shipping workflows into operational playbooks, team procedures, and supply chain training.' }
];

export default function TemplatesSection({ onTemplateSelect, carouselRef, scrollCarousel }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">Get Started</h2>
          <p className="text-xs text-gray-300 hidden sm:block">Choose a template to get started quickly.</p>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => scrollCarousel('left')}
            className="p-1.5 bg-[#3A3A3A] hover:bg-[#1b365d] text-slate-300 hover:text-white rounded-sm shadow-md transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 stroke-[2]" />
          </button>
          <button
            onClick={() => scrollCarousel('right')}
            className="p-1.5 bg-[#3A3A3A] hover:bg-[#1b365d] text-slate-300 hover:text-white rounded-sm shadow-md transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 stroke-[2]" />
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-4 pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          id="template-carousel"
        >
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              className="flex-shrink-0 w-64 rounded-sm overflow-hidden hover:border-[#1b365d] border border-transparent transition-colors group cursor-pointer relative"
            >
              <div className="w-full h-48 bg-[#1E1E1E] flex items-center justify-center overflow-hidden border-none">
                <img
                  src={template.src}
                  alt={template.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
