import { 
  UserProfile, 
  AcademicProject, 
  AcademicSource, 
  MarketplaceTemplate, 
  WalletTransaction 
} from './types';

export const DEFAULT_USER: UserProfile = {
  email: 'researcher@prorite.edu',
  fullName: 'Tunde Olawale',
  studentId: 'PR-2026-9041',
  academicLevel: 'Undergraduate',
  institution: 'University of Ibadan',
  department: 'Computer Science',
  researchInterests: ['Natural Language Processing', 'Distributed Systems', 'Socio-economic Data Analysis'],
  plan: 'Student',
  walletBalance: 45000, // NGN (Nigerian Naira)
};

export const INITIAL_PROJECTS: AcademicProject[] = [
  {
    id: 'proj-1',
    title: 'AI-Based Agricultural Disease Prediction Model for Cassava Farmers in Southwest Nigeria',
    academicLevel: 'Undergraduate',
    department: 'Computer Science',
    style: 'APA 7th Edition',
    currentChapter: 1,
    lastUpdated: '2026-06-12 14:32',
    chapters: {
      1: {
        title: 'Introduction',
        content: `## 1.1 Background of the Study\nCassava (*Manihot esculenta*) is a staple crop of paramount socio-economic importance across sub-Saharan Africa, particularly in Nigeria, which stands as the world's largest producer. Yet, cassava cultivation is severely constrained by viral pathogens, with Cassava Mosaic Disease (CMD) and Cassava Brown Streak Disease (CBSD) causing up to 80% crop losses in vulnerable agricultural zones. Traditional detection methods rely heavily on periodic macroscopic inspection by crop extension officers, who are often in short supply.\n\nWith advancements in computer vision and artificial intelligence, automatic detection offers a reliable, instantaneous method of diagnostics using portable handheld smartphones. This study proposes a lightweight mobile convolutional neural network optimized for offline identification of CMD on-field.\n\n## 1.2 Statement of the Problem\nDespite cassava's central role, yield productivity is hampered by erratic crop supervision and slow diagnostics. Smallholder farmers often misdiagnose disease vectors or apply redundant pesticides, resulting in ecological degradation and financial strain. Immediate visual alerts on disease manifestations are needed to avert large-scale famine and stabilize regional food securities.`,
        references: [
          'Animashaun, J. O. (2021). Cassava value chain and regional food stability in West Africa. *African Journal of Agriculture*, 14(2), 112-125.',
          'Nduka, O. E., & Gabriel, C. T. (2024). Mobile application of computer vision in smallholder farms. *IEEE Agritech Transactions*, 8(3), 204-211.'
        ]
      },
      2: {
        title: 'Literature Review',
        content: `## 2.1 Theoretical Framework\nThis study is anchored on the *Adoption of Agricultural Innovation Theory* alongside *Information Fidelity models*. Crop diagnostics using sensory devices depends on user acceptance indexes within local cooperatives.\n\n## 2.2 Conceptual Review\nComputer vision researchers have tested diverse CNN backends. ResNet-50 and MobileNet are commonly juxtaposed because of the trade-off between deployment weights and accuracy ratios on mobile ARM chipsets.`,
        references: [
          'Okolo, F. A., & Alao, M. S. (2023). Lightweight neural networks for sub-Saharan agricultural ecosystems. *Journal of Crop Science and AI*, 19(4), 312-329.'
        ]
      },
      3: {
        title: 'Research Methodology',
        content: `## 3.1 Research Design\n This study uses an *Experimental Systems Development* methodology combined with a field survey of selected cassava cooperatives in Oyo State.\n\n## 3.2 Target Population\nCassava farms cataloged across Oyo and Ogun states, encompassing over 1,200 smallholder plots operating within the FADAMA program.`,
        references: []
      }
    },
    tableOfContents: [
      '1. INTRODUCTION',
      '  1.1 Background of the Study',
      '  1.2 Statement of the Problem',
      '  1.3 Objectives of the Study',
      '  1.4 Research Questions',
      '  1.5 Scope of the Study',
      '2. LITERATURE REVIEW',
      '  2.1 Theoretical Framework',
      '  2.2 Empirical Review',
      '  2.3 Research Gaps',
      '3. METHODOLOGY',
      '  3.1 Research Design',
      '  3.2 Source of Data',
      '  3.3 Experimental Setup'
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Dr. Adesina (Supervisor)',
        text: 'Review chapter 1.1 statement to align closer with regional Nigerian statistics from the NBS.',
        chapter: 1,
        timestamp: '2026-06-13 10:15',
        resolved: false
      },
      {
        id: 'c-2',
        author: 'Dr. Adesina (Supervisor)',
        text: 'The theoretical framework is clear, but include a comparison table of MobileNet vs ResNet weights.',
        chapter: 2,
        timestamp: '2026-06-13 11:40',
        resolved: false
      }
    ],
    versions: [
      {
        id: 'v-1',
        versionName: 'Initial Thesis Abstract Draft',
        chapter: 1,
        timestamp: '2026-06-10 09:00',
        content: 'Draft 1 copy'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'An Assessment of Corporate Governance Failures and Bank Insolvencies in the Nigerian Financial Services Sector',
    academicLevel: 'Final Year',
    department: 'Accounting',
    style: 'Harvard',
    currentChapter: 1,
    lastUpdated: '2026-06-05 18:22',
    chapters: {
      1: {
        title: 'Introduction',
        content: `## 1.1 Background\nThe history of commercial banking in Nigeria is marked by periodic structural shocks, mergers, and institutional bailouts. Auditing protocols frequently highlight structural compromises in loan approvals and microfinance management...`,
        references: []
      }
    }
  }
];

export const ACADEMIC_DISCIPLINES = [
  'Computer Science',
  'Engineering',
  'Education',
  'Accounting',
  'Marketing',
  'Nursing',
  'Law',
  'Economics',
  'Agriculture',
  'Medicine',
  'Political Science'
];

export const ACADEMIC_RESOURCES: AcademicSource[] = [
  {
    id: 'src-1',
    title: 'Computer Vision Architectures for Cassava Disease Leaf Diagnostics in Tropical Climates',
    authors: 'Adegbola, A., & Nwosu, K. C.',
    year: 2024,
    source: 'Journal of African Agritech Research',
    doi: '10.1102/jaar.2024.11',
    url: 'https://scholar.google.com',
    citeCount: 38,
    type: 'Journal',
    abstract: 'This paper evaluates MobileNetV3 and YOLOv8 models for instant on-leaf recognition of cassava brown streak virus. Testing across South-West Nigeria showed an F1-score of 92.4% with minimal edge latency.',
    department: 'Computer Science'
  },
  {
    id: 'src-2',
    title: 'An Empirical Review of Corporate Audits and Insolvencies in West African Banks (2015-2025)',
    authors: 'Eze, M. U., & Babatunde, S. A.',
    year: 2025,
    source: 'West African Financial Review',
    doi: '10.2241/wafr.v12i4',
    url: 'https://scholar.google.com',
    citeCount: 15,
    type: 'Journal',
    abstract: 'An investigation of executive oversight committees and stress-testing benchmarks during the central banking liquidity adjustments.',
    department: 'Accounting'
  },
  {
    id: 'src-3',
    title: 'Academic Performance Indicators and Mobile Addiction Among Post-Primary Students in Ogun State',
    authors: 'Ajetunmobi, O. O.',
    year: 2023,
    source: 'Nigerian Journal of Educational Studies',
    citeCount: 52,
    type: 'Journal',
    abstract: 'Applying standard ANOVA equations to isolate the exact impact and duration profiles of screen-time exposure on senior secondary WAEC outcomes.',
    department: 'Education'
  },
  {
    id: 'src-4',
    title: 'Clinical Workflow Optimizations in High-Density Pediatric Wards: A Qualitative Case Study of UCH Ibadan',
    authors: 'Okonkwo, P., & Fatimah, Z.',
    year: 2026,
    source: 'Nigerian Nursing & Medicine Reports',
    citeCount: 9,
    type: 'Thesis',
    abstract: 'Qualitative analysis of nursing shift frequencies, patient-to-bed ratios, and stress responses in dynamic emergency clinic workflows.',
    department: 'Nursing'
  }
];

export const MARKETPLACE_TEMPLATES: MarketplaceTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Undergraduate BSc Project Proposal Layout (UI Compliant)',
    price: 3500,
    downloads: 1420,
    rating: 4.8,
    author: 'Prof. Adeboye',
    category: 'Computer Science',
    description: 'Fully formatted docx outlining mandatory chapters, spacing rules, and standard APA 7 references required at Nigerian universities.'
  },
  {
    id: 'tpl-2',
    title: 'Master of Science (MSc) Thesis Style Framework',
    price: 7500,
    downloads: 850,
    rating: 4.9,
    author: 'Dr. Ndube',
    category: 'Engineering',
    description: 'Double-blind review template with advanced automated margins, custom lists for equations, and IEEE citation presets.'
  },
  {
    id: 'tpl-3',
    title: 'Grant Proposal Presentation & Budget Model',
    price: 15000,
    downloads: 310,
    rating: 4.7,
    author: 'Research Cons. Ltd',
    category: 'Agriculture',
    description: 'Grant Application template suitable for international donor sponsorships like NIH, Bill & Melinda Gates, and TETFund.'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    type: 'credit',
    amount: 50000,
    purpose: 'Wallet funding using Flutterwave secure card checkout',
    date: '2026-06-01 10:15',
    gateway: 'Flutterwave'
  },
  {
    id: 'tx-2',
    type: 'debit',
    amount: 5000,
    purpose: 'Upgraded subscription tier to Academic Student Plan',
    date: '2026-06-01 10:18'
  }
];
