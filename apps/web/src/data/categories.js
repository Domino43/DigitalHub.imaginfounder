/**
 * DigitalHub category tree
 * ADHD-first order: start with planners, organizers, kids tools.
 * Parents are shoppable filters; children are subcategories.
 */
export const CATEGORY_TREE = [
  {
    name: 'Planners',
    icon: '📅',
    children: ['Weekly', 'Daily', 'Monthly', 'Yearly', 'Academic Planners'],
  },
  {
    name: 'Organizers',
    icon: '🗂',
    children: [
      'Budget Trackers',
      'Meal Planners',
      'Habit Trackers',
      'Goal Setting Worksheets',
      'Nurse Planner',
      'Teacher Planner',
      'Mom Planner',
    ],
  },
  {
    name: 'Digital Planners',
    icon: '💻',
    children: [
      'Annual Digital Planners',
      'Hyperlinked Monthly Views',
      'Digital Journal',
      'Study Templates',
      'iPad Wellness Tracker',
    ],
  },
  {
    name: 'Kids Worksheets',
    icon: '📝',
    children: ['Preschool Worksheets', 'Reading Comprehension', 'Themed Packs'],
  },
  {
    name: 'Kids Activities',
    icon: '🎨',
    children: [
      'Alphabet Tracing',
      'Homeschool Supplements',
      'Reward Charts',
      'Chore Charts',
    ],
  },
  {
    name: 'Finance Templates',
    icon: '💰',
    children: ['Budget Trackers'],
  },
  {
    name: 'Coloring Pages',
    icon: '🖌',
    children: [
      'Mandala Coloring Pages',
      'Botanical Coloring Sheets',
      'Inspirational Quotes',
      'Seasonal Coloring',
      'Mindfulness Packs',
    ],
  },
  {
    name: 'Wall Art',
    icon: '🖼',
    children: [
      'Botanical Prints',
      'Motivational Quotes',
      'Abstract Boho Art',
      'Gallery Wall Sets',
      'Nursery Art',
      'Personalized Family Prints',
    ],
  },
  {
    name: 'Wedding Invitations',
    icon: '💍',
    children: [
      'Bridal Shower',
      'Wedding Invitations',
      'RSVP Cards',
      'Editable Wedding Invitations',
    ],
  },
  {
    name: 'Event Invitations',
    icon: '💌',
    children: ['Save The Date Cards', 'Baby Shower Invites'],
  },
  {
    name: 'Holiday Printables',
    icon: '🎄',
    children: [],
  },
  {
    name: 'Seasonal Printables',
    icon: '🍂',
    children: [
      'Xmas Gift Tags',
      'Valentine Day Cards',
      'Halloween Party Decor',
      'Easter Activity Sheets',
      'Thanksgiving Place Cards',
    ],
  },
  {
    name: 'Party Printables',
    icon: '🎉',
    children: [
      'Party Favor Tags',
      'Birthday Banners',
      'Food Tent Labels',
      'Full Party Kits',
    ],
  },
  {
    name: 'Birthday Invitations',
    icon: '🎂',
    children: [
      'Kids Birthday Invitations',
      'Adult Milestone Birthday Invitations',
    ],
  },
  {
    name: 'Business Templates',
    icon: '💼',
    children: [
      'Invoice Templates',
      'Client Intake Forms',
      'Business Planner Bundle',
      'Social Media Content Calendars',
      'Freelancer Contracts',
    ],
  },
  {
    name: 'Gift Certificates',
    icon: '🎁',
    children: ['Editable Gift Certificate', 'Gift Card Inserts'],
  },
  {
    name: 'Thank You',
    icon: '🙏',
    children: ['Thank You Cards', 'Custom Note Cards'],
  },
  {
    name: 'Tags',
    icon: '🏷',
    children: ['Thank You Tags'],
  },
];

export const PARENT_CATEGORIES = CATEGORY_TREE.map((c) => c.name);

export const ALL_CATEGORY_NAMES = CATEGORY_TREE.flatMap((c) => [c.name, ...c.children]);

export const getCategoryByName = (name) =>
  CATEGORY_TREE.find((c) => c.name === name);

export const getParentForSubcategory = (subcategory) =>
  CATEGORY_TREE.find((c) => c.children.includes(subcategory));

export const productMatchesCategory = (product, selectedCategory, selectedSubcategory) => {
  if (selectedSubcategory) {
    return product.subcategory === selectedSubcategory;
  }
  if (!selectedCategory || selectedCategory === 'All Products') {
    return true;
  }
  return (
    product.type?.value === selectedCategory ||
    product.subcategory === selectedCategory
  );
};

export default CATEGORY_TREE;
