/**
 * Seed script for Thong Huynh Minh's Portfolio
 * Run with: npx prisma db seed
 * Or: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing existing data...');

  // Delete in correct order to respect foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.pageLayout.deleteMany();
  await prisma.aboutSection.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.siteConfig.deleteMany();
  // Keep users - don't delete auth data
  // await prisma.session.deleteMany();
  // await prisma.account.deleteMany();
  // await prisma.user.deleteMany();

  console.log('✅ Existing data cleared\n');

  // ==================== ADMIN USER ====================
  console.log('👤 Creating/updating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // ==================== PROFILE ====================
  console.log('👤 Creating profile...');
  await prisma.profile.create({
    data: {
      name: 'Thong Huynh Minh',
      title: 'Frontend Engineer',
      email: 'thongminh.huynh19@gmail.com',
      phone: '+84 917566726',
      location: 'District 04, HCMC, Vietnam',
      bio: 'Frontend Engineer with 3+ years of experience building large-scale enterprise applications using Angular. Proven leadership in leading frontend teams, designing reusable component systems, and optimizing complex user interfaces. Adept in performance tuning, dynamic UIs, and cross-functional collaboration. Passionate about applying AI and automation to improve developer workflows.',
      social: {
        github: 'https://github.com/Huynhthong1',
        linkedin: 'https://www.linkedin.com/in/thong-huynh-minh-86b438219/',
        email: 'thongminh.huynh19@gmail.com',
      },
    },
  });

  // ==================== SITE CONFIG ====================
  console.log('⚙️  Creating site config...');
  await prisma.siteConfig.createMany({
    data: [
      {
        key: 'meta',
        value: {
          title: 'Thong Huynh Minh | Frontend Engineer',
          description: 'Frontend Engineer with 3+ years of experience building large-scale enterprise applications. Specialized in Angular, React, Vue.js, and modern web technologies.',
          keywords: ['Frontend Engineer', 'Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript', 'Web Developer', 'Vietnam'],
          author: 'Thong Huynh Minh',
          siteUrl: 'https://thonghuynh.dev',
          ogImage: '/og-image.png',
          locale: 'en_US',
        },
      },
      {
        key: 'theme',
        value: {
          mode: 'dark',
          primaryColor: '#8b5cf6',
          accentColor: '#06b6d4',
        },
      },
      {
        key: 'layout',
        value: {
          header: {
            visible: true,
            sticky: true,
            transparent: false,
            navItems: [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/#about' },
              { label: 'Projects', href: '/#projects' },
              { label: 'Experience', href: '/#experience' },
              { label: 'Contact', href: '/contact' },
            ],
          },
          footer: {
            visible: true,
            showSocial: true,
            copyright: '© 2025 Thong Huynh Minh. All rights reserved.',
          },
        },
      },
    ],
  });

  // ==================== EXPERIENCE ====================
  console.log('💼 Creating experiences...');
  await prisma.experience.createMany({
    data: [
      {
        company: 'FPT IS',
        position: 'Frontend Engineer',
        location: 'Ho Chi Minh City, Vietnam',
        startDate: new Date('2025-04-01'),
        endDate: null,
        current: true,
        description: `E-hiring System Development:
• Upgraded Angular version from v8 to v19
• Developed a new core system with fully dynamic form, layout, and component rendering
• Implemented role-based authorization and secure access logic
• Boosted performance by optimizing rendering and lazy-loading large datasets
• Maintain, operate, and support additional customer requests`,
        technologies: ['Angular 19', 'RxJS', 'Jsonata', 'TailwindCSS', 'Ant Design', 'LESS', 'NestJS', 'MongoDB', 'GitLab', 'Docker', 'Nx'],
        order: 1,
        visible: true,
      },
      {
        company: 'FPT IS',
        position: 'Frontend Engineer',
        location: 'Ho Chi Minh City, Vietnam',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2025-04-01'),
        current: false,
        description: `HR Management System - Led Frontend Component Team (10 members):
• Led a frontend component team of 10 people in reviewing merge requests, task assignment, and architecture planning with SA/TA
• Engaged with clients for requirement analysis and estimations
• Refactored critical components, improving loading of 100k+ records
• Contributed to build fast 1000+ screen system with reusable component architecture
• Collaborated with 200+ cross-functional members`,
        technologies: ['Angular 18', 'RxJS', 'LESS', 'TailwindCSS', 'REST API', 'API Gateway', 'Jsonata', 'Nx', 'MySQL', 'Docker', 'GitLab'],
        order: 2,
        visible: true,
      },
      {
        company: 'Freelancer',
        position: 'Frontend Developer',
        location: 'Remote',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        current: false,
        description: `Store Management System:
• Developed a Store Management System: Led the creation of a dynamic, interactive platform for city-wide store management
• Built scalable, maintainable UI components using Vue 3 and its Composition API
• Utilized Mapbox and Google Maps APIs to implement interactive, real-time maps
• Ensured a modular and efficient architecture for the entire application`,
        technologies: ['Vue 3', 'Mapbox API', 'Google Maps API', 'Lodash', 'Bootstrap 5', 'SCSS', 'REST API', 'GitLab'],
        order: 3,
        visible: true,
      },
      {
        company: 'DXC Technology',
        position: 'Associate Frontend Developer',
        location: 'Ho Chi Minh City, Vietnam',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2024-05-31'),
        current: false,
        description: `Insurance System Development:
• Built an insurance system about business, scaled up to 1000 screens, with multiple flows and complexity business as the customer required
• Using dynamic component, screens to make a new screen easier and faster
• Contribution by built a directive and pipe to convert and format the currency`,
        technologies: ['Angular 8', 'MUI', 'SASS', 'Lodash', 'REST API', 'Axios', 'Jira', 'Jenkins', 'GitHub'],
        order: 4,
        visible: true,
      },
    ],
  });

  // ==================== EDUCATION ====================
  console.log('🎓 Creating education...');
  await prisma.education.create({
    data: {
      institution: 'University of Greenwich',
      degree: 'BSc in Software Engineering',
      field: 'Software Engineering',
      location: 'Ho Chi Minh City, Vietnam',
      startDate: new Date('2018-08-01'),
      endDate: new Date('2022-01-31'),
      description: 'Second Class Honors (1st Division)',
      order: 1,
      visible: true,
    },
  });

  // ==================== SKILLS ====================
  console.log('🛠️  Creating skills...');
  const skills = [
    // Languages & Frameworks
    { name: 'Angular', iconId: 'angular', category: 'Frontend', proficiency: 95, order: 1 },
    { name: 'React', iconId: 'react', category: 'Frontend', proficiency: 80, order: 2 },
    { name: 'Vue.js', iconId: 'vuejs', category: 'Frontend', proficiency: 85, order: 3 },
    { name: 'TypeScript', iconId: 'typescript', category: 'Frontend', proficiency: 95, order: 4 },
    { name: 'JavaScript', iconId: 'javascript', category: 'Frontend', proficiency: 95, order: 5 },
    { name: 'RxJS', iconId: 'redux', category: 'Frontend', proficiency: 90, order: 6 },

    // UI/UX
    { name: 'HTML5', iconId: 'html5', category: 'UI/UX', proficiency: 95, order: 1 },
    { name: 'CSS3', iconId: 'css3', category: 'UI/UX', proficiency: 95, order: 2 },
    { name: 'SCSS/SASS', iconId: 'sass', category: 'UI/UX', proficiency: 90, order: 3 },
    { name: 'TailwindCSS', iconId: 'tailwindcss', category: 'UI/UX', proficiency: 90, order: 4 },
    { name: 'Bootstrap', iconId: 'bootstrap', category: 'UI/UX', proficiency: 85, order: 5 },
    { name: 'Ant Design', iconId: null, icon: '🐜', category: 'UI/UX', proficiency: 85, order: 6 },
    { name: 'Material UI', iconId: 'materialui', category: 'UI/UX', proficiency: 80, order: 7 },

    // Data & Backend
    { name: 'REST API', iconId: 'swagger', category: 'Backend', proficiency: 90, order: 1 },
    { name: 'NestJS', iconId: 'nestjs', category: 'Backend', proficiency: 75, order: 2 },
    { name: 'MongoDB', iconId: 'mongodb', category: 'Backend', proficiency: 75, order: 3 },
    { name: 'PostgreSQL', iconId: 'postgresql', category: 'Backend', proficiency: 70, order: 4 },
    { name: 'MySQL', iconId: 'mysql', category: 'Backend', proficiency: 75, order: 5 },

    // Tools & Libraries
    { name: 'Git', iconId: 'git', category: 'Tools', proficiency: 95, order: 1 },
    { name: 'GitLab', iconId: 'gitlab', category: 'Tools', proficiency: 90, order: 2 },
    { name: 'GitHub', iconId: 'github', category: 'Tools', proficiency: 90, order: 3 },
    { name: 'Docker', iconId: 'docker', category: 'Tools', proficiency: 75, order: 4 },
    { name: 'Jira', iconId: 'jira', category: 'Tools', proficiency: 85, order: 5 },
    { name: 'Figma', iconId: 'figma', category: 'Tools', proficiency: 80, order: 6 },
    { name: 'Jest', iconId: 'jest', category: 'Tools', proficiency: 80, order: 7 },
    { name: 'Nx Monorepo', iconId: null, icon: '📦', category: 'Tools', proficiency: 85, order: 8 },

    // Others
    { name: 'Agile/Scrum', iconId: null, icon: '🔄', category: 'Others', proficiency: 90, order: 1 },
    { name: 'CI/CD', iconId: 'jenkins', category: 'Others', proficiency: 80, order: 2 },
    { name: 'Unit Testing', iconId: 'vitest', category: 'Others', proficiency: 85, order: 3 },
    { name: 'Mapbox', iconId: null, icon: '🗺️', category: 'Others', proficiency: 80, order: 4 },
    { name: 'Google Maps API', iconId: 'googlecloud', category: 'Others', proficiency: 80, order: 5 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        name: skill.name,
        iconId: skill.iconId,
        icon: (skill as any).icon || null,
        category: skill.category,
        proficiency: skill.proficiency,
        order: skill.order,
        visible: true,
      },
    });
  }

  // ==================== PROJECTS ====================
  console.log('🚀 Creating projects...');
  await prisma.project.createMany({
    data: [
      {
        slug: 'hr-management-system',
        title: 'HR Management System',
        description: 'Large-scale HR management platform with 1000+ screens, supporting 200+ cross-functional team members.',
        longDescription: `A comprehensive HR Management System built at FPT IS:

Key Achievements:
• Led a frontend component team of 10 people
• Built a system with 1000+ screens using reusable component architecture
• Refactored critical components, improving loading of 100k+ records
• Collaborated with 200+ cross-functional members

Technical Highlights:
• Dynamic form and component rendering
• Role-based authorization
• Performance optimization for large datasets
• Monorepo architecture with Nx`,
        image: '/projects/hr-system.png',
        tags: ['Angular 18', 'RxJS', 'TailwindCSS', 'REST API', 'Nx', 'MySQL'],
        links: {},
        featured: true,
        category: 'Enterprise',
        order: 1,
        visible: true,
      },
      {
        slug: 'e-hiring-system',
        title: 'E-Hiring System',
        description: 'Modern recruitment platform with dynamic forms, role-based access, and optimized performance.',
        longDescription: `An E-Hiring System built at FPT IS:

Key Achievements:
• Upgraded Angular from v8 to v19
• Developed fully dynamic form, layout, and component rendering system
• Implemented secure role-based authorization
• Optimized performance with lazy-loading for large datasets

Technical Stack:
• Angular 19, RxJS, TailwindCSS, Ant Design
• NestJS microservices backend
• MongoDB database
• Docker containerization`,
        image: '/projects/e-hiring.png',
        tags: ['Angular 19', 'NestJS', 'MongoDB', 'TailwindCSS', 'Docker'],
        links: {},
        featured: true,
        category: 'Enterprise',
        order: 2,
        visible: true,
      },
      {
        slug: 'store-management-system',
        title: 'Store Management System',
        description: 'Interactive city-wide store management platform with real-time maps and location visualization.',
        longDescription: `A Store Management System built as a freelance project:

Key Features:
• Dynamic, interactive platform for city-wide store management
• Real-time maps with Mapbox and Google Maps APIs
• Scalable, maintainable UI with Vue 3 Composition API
• Modular and efficient architecture

Technical Stack:
• Vue 3 with Composition API
• Mapbox and Google Maps integration
• Bootstrap 5 and SCSS styling
• REST API backend`,
        image: '/projects/store-management.png',
        tags: ['Vue 3', 'Mapbox', 'Google Maps', 'Bootstrap 5', 'SCSS'],
        links: {},
        featured: true,
        category: 'Web App',
        order: 3,
        visible: true,
      },
      {
        slug: 'insurance-system',
        title: 'Insurance System',
        description: 'Enterprise insurance platform scaled to 1000 screens with complex business flows.',
        longDescription: `An Insurance System built at DXC Technology:

Key Achievements:
• Built a system scaled to 1000 screens
• Handled multiple complex business flows
• Created dynamic components for rapid screen development
• Built custom directives and pipes for currency formatting

Technical Stack:
• Angular 8, MUI library
• SASS styling, Lodash utilities
• REST API with Axios
• Jenkins CI/CD pipeline`,
        image: '/projects/insurance.png',
        tags: ['Angular 8', 'MUI', 'SASS', 'REST API', 'Jenkins'],
        links: {},
        featured: false,
        category: 'Enterprise',
        order: 4,
        visible: true,
      },
    ],
  });

  // ==================== ABOUT SECTION ====================
  console.log('📝 Creating about section...');
  await prisma.aboutSection.create({
    data: {
      sectionLabel: 'About Me',
      title: 'Frontend Engineer,',
      titleHighlight: 'Team Leader',
      description: [
        "I'm a Frontend Engineer with 3+ years of experience building large-scale enterprise applications. My expertise lies in Angular, with strong skills in React and Vue.js as well.",
        'I have proven leadership experience, having led a frontend team of 10 developers. I specialize in designing reusable component systems, optimizing complex user interfaces, and performance tuning for applications handling 100k+ records.',
        "I'm passionate about applying AI and automation to improve developer workflows, and I'm always exploring new technologies and solutions to stay at the cutting edge of frontend development.",
      ],
      skills: [
        { name: 'Angular Expert' },
        { name: 'Team Leadership' },
        { name: 'Performance Optimization' },
        { name: 'Enterprise Apps' },
        { name: 'Dynamic UIs' },
        { name: 'Cross-functional Collaboration' },
      ],
      yearsExperience: 3,
      projectsCount: 4,
      highlights: [
        { icon: 'code', title: 'Enterprise Scale', description: 'Built systems with 1000+ screens' },
        { icon: 'zap', title: 'Performance', description: 'Optimized loading for 100k+ records' },
      ],
      profileImage: '/images/avatar.png',
      showImage: true,
      showThreeBackground: true,
      imagePosition: 'right',
    },
  });

  // ==================== PAGE LAYOUTS ====================
  console.log('📄 Creating page layouts...');
  await prisma.pageLayout.createMany({
    data: [
      {
        pageName: 'home',
        sections: [
          {
            id: 'hero',
            type: 'hero',
            order: 1,
            enabled: true,
            config: {
              headline: 'Hi, I\'m Thong Huynh Minh',
              subheadline: 'Available for hire',
              description: 'Frontend Engineer with 3+ years of experience building large-scale enterprise applications. Specialized in Angular, React, and Vue.js. Passionate about creating dynamic UIs and optimizing performance.',
              ctaPrimary: { label: 'View My Work', href: '#projects' },
              ctaSecondary: { label: 'Download CV', href: '/cv.pdf' },
              stats: [
                { value: '3+', label: 'Years Experience' },
                { value: '1000+', label: 'Screens Built' },
                { value: '200+', label: 'Team Collaboration' },
              ],
            },
          },
          { id: 'about', type: 'about', order: 2, enabled: true, config: {} },
          { id: 'skills', type: 'skills', order: 3, enabled: true, config: {} },
          { id: 'experience', type: 'experience', order: 4, enabled: true, config: {} },
          { id: 'projects', type: 'projects', order: 5, enabled: true, config: {} },
          { id: 'contact-cta', type: 'contact-cta', order: 6, enabled: true, config: {} },
        ],
      },
      {
        pageName: 'about',
        sections: [
          { id: 'about', type: 'about', order: 1, enabled: true, config: {} },
          { id: 'skills', type: 'skills', order: 2, enabled: true, config: {} },
          { id: 'experience', type: 'experience', order: 3, enabled: true, config: {} },
        ],
      },
      {
        pageName: 'projects',
        sections: [
          { id: 'projects', type: 'projects', order: 1, enabled: true, config: { showAll: true } },
        ],
      },
      {
        pageName: 'contact',
        sections: [
          { id: 'contact', type: 'contact', order: 1, enabled: true, config: {} },
        ],
      },
    ],
  });

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - 1 Admin User');
  console.log('   - 1 Profile (Thong Huynh Minh)');
  console.log('   - 3 Site Configs');
  console.log('   - 4 Experiences');
  console.log('   - 1 Education');
  console.log('   - ' + skills.length + ' Skills');
  console.log('   - 4 Projects');
  console.log('   - 1 About Section');
  console.log('   - 4 Page Layouts');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
