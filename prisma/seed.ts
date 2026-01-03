import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create default profile
  const profile = await prisma.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'John Doe',
      title: 'Full-Stack Developer',
      email: 'john@example.com',
      location: 'Ho Chi Minh City, Vietnam',
      bio: 'Passionate full-stack developer with 3+ years of experience building scalable web applications.',
      social: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
      },
    },
  });

  console.log('Created profile:', profile.name);

  // Create site config
  const configs = [
    {
      key: 'meta',
      value: {
        title: 'John Doe | Full-Stack Developer',
        description: 'Full-stack developer with 3+ years of experience in React, Next.js, .NET, and cloud technologies',
        keywords: ['developer', 'react', 'nextjs', 'typescript', 'dotnet'],
        author: 'John Doe',
        siteUrl: 'https://johndoe.dev',
        ogImage: '/images/og-image.jpg',
        locale: 'en_US',
      },
    },
    {
      key: 'theme',
      value: {
        mode: 'system',
        primaryColor: '#0066FF',
        accentColor: '#00D4FF',
        fontFamily: 'Inter',
        borderRadius: '0.5rem',
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
            { label: 'About', href: '/about' },
            { label: 'Projects', href: '/projects' },
            { label: 'Experience', href: '/experience' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        footer: {
          visible: true,
          showSocial: true,
          copyright: '© 2024 John Doe. All rights reserved.',
        },
      },
    },
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  console.log('Created site configs');

  // Create default page layouts
  const homeLayout = await prisma.pageLayout.upsert({
    where: { pageName: 'home' },
    update: {},
    create: {
      pageName: 'home',
      sections: [
        {
          id: 'hero',
          type: 'hero',
          order: 1,
          visible: true,
          props: {
            headline: "Hi, I'm John Doe",
            subheadline: 'Full-Stack Developer',
            description: 'I build exceptional digital experiences',
            ctaPrimary: {
              label: 'View Projects',
              href: '/projects',
            },
            ctaSecondary: {
              label: 'Download CV',
              href: '/resume.pdf',
            },
            showTypingEffect: true,
            backgroundStyle: 'gradient',
          },
        },
        {
          id: 'skills',
          type: 'skills',
          order: 2,
          visible: true,
          props: {
            title: 'Tech Stack',
            layout: 'grid',
            showProficiency: true,
          },
        },
        {
          id: 'about',
          type: 'about',
          order: 3,
          visible: true,
          props: {
            showImage: true,
            imagePosition: 'right',
          },
        },
        {
          id: 'projects',
          type: 'projects',
          order: 4,
          visible: true,
          props: {
            title: 'Featured Projects',
            maxItems: 3,
            showViewAll: true,
            layout: 'cards',
          },
        },
        {
          id: 'contact-cta',
          type: 'contact-cta',
          order: 5,
          visible: true,
          props: {
            title: "Let's Work Together",
            description: "Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your ideas to life.",
            primaryCTA: {
              label: 'Get In Touch',
              href: '/contact',
            },
            secondaryCTA: {
              label: 'Schedule a Call',
              href: '/contact',
            },
          },
        },
      ],
    },
  });

  console.log('Created page layouts');

  // Create sample projects
  const sampleProjects = [
    {
      slug: 'healthcare-platform',
      title: 'Healthcare Digital Platform',
      description: 'A comprehensive digital health platform with real-time chat, patient management, and provider communication.',
      longDescription: 'Built a full-featured healthcare application enabling seamless communication between patients and healthcare providers with real-time messaging, appointment scheduling, and secure document sharing.',
      tags: ['React', 'TypeScript', '.NET Core', 'SignalR', 'PostgreSQL'],
      links: { demo: 'https://demo.example.com', github: 'https://github.com/johndoe/healthcare' },
      featured: true,
      category: 'web',
      order: 1,
    },
    {
      slug: 'hr-recruitment',
      title: 'HR Recruitment System',
      description: 'Modern HR recruitment platform with customizable themes and workflow automation.',
      longDescription: 'Developed a comprehensive HR management system with applicant tracking, interview scheduling, and customizable recruitment workflows.',
      tags: ['Angular', 'NestJS', 'MongoDB', 'TailwindCSS'],
      links: { demo: 'https://hr.example.com' },
      featured: true,
      category: 'web',
      order: 2,
    },
    {
      slug: 'ecommerce-platform',
      title: 'E-commerce Platform',
      description: 'Scalable e-commerce solution with microservices architecture.',
      longDescription: 'Built a high-performance e-commerce platform using microservices architecture, featuring real-time inventory management and payment processing.',
      tags: ['Next.js', 'Node.js', 'Kubernetes', 'Redis'],
      links: {},
      featured: true,
      category: 'web',
      order: 3,
    },
  ];

  for (const project of sampleProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    });
  }

  console.log('Created sample projects');

  // Create sample skills
  const skills = [
    { name: 'React', category: 'Frontend', proficiency: 90, order: 1 },
    { name: 'Next.js', category: 'Frontend', proficiency: 85, order: 2 },
    { name: 'TypeScript', category: 'Frontend', proficiency: 88, order: 3 },
    { name: 'Angular', category: 'Frontend', proficiency: 75, order: 4 },
    { name: '.NET Core', category: 'Backend', proficiency: 85, order: 1 },
    { name: 'Node.js', category: 'Backend', proficiency: 80, order: 2 },
    { name: 'NestJS', category: 'Backend', proficiency: 78, order: 3 },
    { name: 'PostgreSQL', category: 'Database', proficiency: 82, order: 1 },
    { name: 'MongoDB', category: 'Database', proficiency: 80, order: 2 },
    { name: 'Docker', category: 'DevOps', proficiency: 75, order: 1 },
    { name: 'Kubernetes', category: 'DevOps', proficiency: 65, order: 2 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill,
    });
  }

  console.log('Created skills');

  // Create sample experience
  const sampleExperience = [
    {
      company: 'Tech Company',
      position: 'Full-Stack Developer',
      location: 'Ho Chi Minh City, Vietnam',
      startDate: new Date('2022-01-01'),
      endDate: null,
      current: true,
      description: '- Developed and maintained healthcare digital platform\n- Implemented real-time chat using SignalR\n- Optimized database queries reducing response time by 40%\n- Led frontend architecture migration to React 18',
      technologies: ['React', '.NET Core', 'PostgreSQL', 'Docker'],
      order: 1,
    },
    {
      company: 'Startup Inc',
      position: 'Frontend Developer',
      location: 'Ho Chi Minh City, Vietnam',
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-12-31'),
      current: false,
      description: '- Built responsive web applications using React\n- Collaborated with UX team to implement design systems\n- Improved page load performance by 50%',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      order: 2,
    },
  ];

  for (const exp of sampleExperience) {
    await prisma.experience.create({
      data: exp,
    });
  }

  console.log('Created sample experience');

  // Create sample education
  const sampleEducation = [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Computer Science',
      field: 'Software Engineering',
      location: 'Ho Chi Minh City, Vietnam',
      startDate: new Date('2017-09-01'),
      endDate: new Date('2021-06-30'),
      description: 'Focused on software engineering and web technologies',
      order: 1,
    },
  ];

  for (const edu of sampleEducation) {
    await prisma.education.create({
      data: edu,
    });
  }

  console.log('Created sample education');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
