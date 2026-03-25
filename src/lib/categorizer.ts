import { Repo } from '@/db/schema';

interface CategoryRule {
  name: string;
  slug: string;
  emoji: string;
  color: string;
  keywords: string[];
  languages: string[];
}

const categoryRules: CategoryRule[] = [
  {
    name: 'Web Development',
    slug: 'web-development',
    emoji: '🌐',
    color: '#3B82F6',
    keywords: ['web', 'frontend', 'backend', 'api', 'react', 'vue', 'angular', 'next', 'express'],
    languages: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
  },
  {
    name: 'CLI Tools',
    slug: 'cli-tools',
    emoji: '⚡',
    color: '#10B981',
    keywords: ['cli', 'command-line', 'terminal', 'console'],
    languages: ['Go', 'Rust', 'Python'],
  },
  {
    name: 'Data & AI',
    slug: 'data-ai',
    emoji: '🤖',
    color: '#8B5CF6',
    keywords: ['ai', 'ml', 'machine-learning', 'data', 'analytics', 'neural'],
    languages: ['Python', 'R', 'Julia'],
  },
  {
    name: 'DevOps & Infrastructure',
    slug: 'devops',
    emoji: '🚀',
    color: '#F59E0B',
    keywords: ['docker', 'kubernetes', 'ci', 'cd', 'deployment', 'infrastructure'],
    languages: ['HCL', 'Dockerfile'],
  },
  {
    name: 'Mobile Development',
    slug: 'mobile',
    emoji: '📱',
    color: '#EC4899',
    keywords: ['mobile', 'ios', 'android', 'react-native', 'flutter'],
    languages: ['Swift', 'Kotlin', 'Dart', 'Java'],
  },
  {
    name: 'Game Development',
    slug: 'games',
    emoji: '🎮',
    color: '#EF4444',
    keywords: ['game', 'gaming', 'unity', 'unreal'],
    languages: ['C#', 'C++', 'GDScript'],
  },
  {
    name: 'Libraries & Frameworks',
    slug: 'libraries',
    emoji: '📦',
    color: '#06B6D4',
    keywords: ['library', 'framework', 'sdk', 'package'],
    languages: [],
  },
  {
    name: 'Templates & Starters',
    slug: 'templates',
    emoji: '🎯',
    color: '#84CC16',
    keywords: ['template', 'starter', 'boilerplate', 'scaffold'],
    languages: [],
  },
  {
    name: 'Documentation',
    slug: 'documentation',
    emoji: '📚',
    color: '#6366F1',
    keywords: ['docs', 'documentation', 'wiki', 'guide'],
    languages: [],
  },
  {
    name: 'Utilities',
    slug: 'utilities',
    emoji: '🔧',
    color: '#78716C',
    keywords: ['utility', 'tool', 'helper', 'utils'],
    languages: [],
  },
];

export function suggestCategory(repo: Repo): CategoryRule | null {
  const searchText = [
    repo.name.toLowerCase(),
    repo.description?.toLowerCase() || '',
    ...(repo.topics || []),
  ].join(' ');

  for (const rule of categoryRules) {
    // Check language match
    if (repo.language && rule.languages.includes(repo.language)) {
      return rule;
    }

    // Check keyword match
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword)) {
        return rule;
      }
    }
  }

  return null;
}

export function getDefaultCategories(): CategoryRule[] {
  return categoryRules;
}
