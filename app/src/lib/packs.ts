// Quest Cards - Challenge Packs Data
// Updated for points-based rewards

import { Pack, Challenge } from './types';

export const PACKS: Pack[] = [
  {
    slug: "starter-pack",
    name: "Starter Pack",
    description: "A mix of fun challenges to get started. Perfect first quests!",
    icon: "⭐",
    category: "mixed",
    isBuiltIn: true,
    challenges: [
      {
        slug: "make-your-bed-7-days",
        title: "Bed Boss",
        description: "Make your bed every morning for 7 days in a row!",
        icon: "🛏️",
        difficulty: "easy",
        reward: 30,
        time_estimate: "1 week"
      },
      {
        slug: "try-new-food",
        title: "Brave Bite",
        description: "Try a new food you've never eaten before. One real bite!",
        icon: "🍽️",
        difficulty: "easy",
        reward: 20,
        time_estimate: "1 day"
      },
      {
        slug: "learn-joke",
        title: "Joke Teller",
        description: "Learn a joke and tell it to 3 different people!",
        icon: "😂",
        difficulty: "easy",
        reward: 20,
        time_estimate: "1 day"
      },
      {
        slug: "help-without-asking",
        title: "Secret Helper",
        description: "Do something helpful without being asked. Surprise someone!",
        icon: "🦸",
        difficulty: "easy",
        reward: 20,
        time_estimate: "1 day"
      },
      {
        slug: "read-new-book",
        title: "Book Explorer",
        description: "Read a book you've never read before (or have someone read it to you).",
        icon: "📚",
        difficulty: "easy",
        reward: 20,
        time_estimate: "1 day"
      },
      {
        slug: "draw-family",
        title: "Family Portrait",
        description: "Draw a picture of your family. Include everyone!",
        icon: "👨‍👩‍👧",
        difficulty: "easy",
        reward: 20,
        time_estimate: "30 minutes"
      },
      {
        slug: "learn-5-words",
        title: "Word Collector",
        description: "Learn 5 new words this week. Use each one in a sentence!",
        icon: "📝",
        difficulty: "medium",
        reward: 30,
        time_estimate: "1 week"
      },
      {
        slug: "clean-room",
        title: "Room Rescue",
        description: "Clean your whole room without any reminders!",
        icon: "✨",
        difficulty: "medium",
        reward: 30,
        time_estimate: "1 hour"
      },
      {
        slug: "compliment-spree",
        title: "Kindness Quest",
        description: "Give 5 genuine compliments to different people today!",
        icon: "💝",
        difficulty: "easy",
        reward: 20,
        time_estimate: "1 day"
      },
      {
        slug: "morning-routine-solo",
        title: "Morning Champion",
        description: "Do your whole morning routine by yourself for 3 days!",
        icon: "🌅",
        difficulty: "medium",
        reward: 40,
        time_estimate: "3 days"
      }
    ]
  },
  {
    slug: "art-adventures",
    name: "Art Adventures",
    description: "Creative challenges for little artists. Draw, paint, build, create!",
    icon: "🎨",
    category: "creative",
    isBuiltIn: true,
    challenges: [
      {
        slug: "monster-maker",
        title: "Monster Maker",
        description: "Design your own monster! Give it a name and special powers.",
        icon: "👹",
        difficulty: "easy",
        reward: 20,
        time_estimate: "30 minutes"
      },
      {
        slug: "nature-art",
        title: "Nature Artist",
        description: "Make art using only things from outside - leaves, sticks, rocks!",
        icon: "🍂",
        difficulty: "medium",
        reward: 30,
        time_estimate: "1 hour"
      },
      {
        slug: "cardboard-creation",
        title: "Box Builder",
        description: "Build something cool from cardboard boxes. Robot? Castle? Spaceship?",
        icon: "📦",
        difficulty: "medium",
        reward: 40,
        time_estimate: "2 hours"
      },
      {
        slug: "self-portrait",
        title: "Mirror Me",
        description: "Look in a mirror and draw yourself! Try to get the details right.",
        icon: "🪞",
        difficulty: "medium",
        reward: 30,
        time_estimate: "30 minutes"
      },
      {
        slug: "color-mixing",
        title: "Color Scientist",
        description: "Mix paints to create 5 new colors. Name each one!",
        icon: "🌈",
        difficulty: "easy",
        reward: 20,
        time_estimate: "30 minutes"
      },
      {
        slug: "comic-strip",
        title: "Comic Creator",
        description: "Draw a comic strip with at least 4 panels. Tell a story!",
        icon: "💭",
        difficulty: "hard",
        reward: 50,
        time_estimate: "1 hour"
      },
      {
        slug: "gift-art",
        title: "Gift of Art",
        description: "Make a piece of art as a gift for someone. Give it to them!",
        icon: "🎁",
        difficulty: "medium",
        reward: 30,
        time_estimate: "1 hour"
      },
      {
        slug: "playdough-zoo",
        title: "Dough Zoo",
        description: "Make 5 different animals out of playdough or clay.",
        icon: "🦁",
        difficulty: "medium",
        reward: 30,
        time_estimate: "45 minutes"
      }
    ]
  },
  {
    slug: "life-skills",
    name: "Life Skills",
    description: "Real-world skills that last a lifetime. Learn by doing!",
    icon: "🌟",
    category: "life-skills",
    isBuiltIn: true,
    challenges: [
      {
        slug: "write-letter",
        title: "Letter Writer",
        description: "Write a letter to a grandparent or relative. Address the envelope and mail it!",
        instructions: "1. Write your letter (draw pictures too!)\n2. Put it in an envelope\n3. Write the address on the front\n4. Put a stamp on it\n5. Mail it together!",
        icon: "✉️",
        difficulty: "medium",
        reward: 40,
        time_estimate: "1 hour"
      },
      {
        slug: "make-breakfast",
        title: "Breakfast Chef",
        description: "Make breakfast for yourself (with a grown-up nearby for safety).",
        icon: "🍳",
        difficulty: "medium",
        reward: 30,
        time_estimate: "30 minutes"
      },
      {
        slug: "learn-phone-number",
        title: "Memory Master",
        description: "Memorize a parent's phone number. Recite it from memory!",
        icon: "📱",
        difficulty: "medium",
        reward: 30,
        time_estimate: "1 week"
      },
      {
        slug: "tie-shoes",
        title: "Lace Ace",
        description: "Learn to tie your shoes by yourself. Do it 3 times in a row!",
        icon: "👟",
        difficulty: "hard",
        reward: 50,
        time_estimate: "1 week"
      },
      {
        slug: "set-table",
        title: "Table Setter",
        description: "Set the table for dinner every night for a week. All by yourself!",
        icon: "🍽️",
        difficulty: "easy",
        reward: 30,
        time_estimate: "1 week"
      },
      {
        slug: "simple-recipe",
        title: "Recipe Reader",
        description: "Follow a simple recipe to make a snack. Read each step!",
        instructions: "Pick a simple recipe like:\n- Ants on a log (celery + peanut butter + raisins)\n- Fruit salad\n- Trail mix\n- Smoothie",
        icon: "📖",
        difficulty: "medium",
        reward: 30,
        time_estimate: "30 minutes"
      },
      {
        slug: "fold-laundry",
        title: "Fold Master",
        description: "Fold a whole basket of laundry. Make it neat!",
        icon: "👕",
        difficulty: "medium",
        reward: 30,
        time_estimate: "30 minutes"
      },
      {
        slug: "address-intro",
        title: "Address Expert",
        description: "Learn your full home address. Recite it from memory!",
        icon: "🏠",
        difficulty: "medium",
        reward: 30,
        time_estimate: "1 week"
      }
    ]
  },
  {
    slug: "brain-games",
    name: "Brain Games",
    description: "Puzzles, riddles, and learning challenges to grow your brain!",
    icon: "🧠",
    category: "learning",
    isBuiltIn: true,
    challenges: [
      {
        slug: "memorize-poem",
        title: "Poem Master",
        description: "Memorize a short poem and recite it to your family!",
        instructions: "Pick a poem that's 4-8 lines long. Practice a little each day. When you're ready, perform it!",
        icon: "📜",
        difficulty: "medium",
        reward: 40,
        time_estimate: "1 week"
      },
      {
        slug: "teach-game",
        title: "Game Teacher",
        description: "Learn a new game, then teach it to someone else!",
        instructions: "1. Learn a card game, board game, or outdoor game\n2. Practice until you know the rules well\n3. Teach it to a family member or friend\n4. Play it together!",
        icon: "🎲",
        difficulty: "medium",
        reward: 40,
        time_estimate: "3 days"
      },
      {
        slug: "riddle-collector",
        title: "Riddle Riddler",
        description: "Learn 3 riddles and stump your family with them!",
        icon: "❓",
        difficulty: "easy",
        reward: 20,
        time_estimate: "1 day"
      },
      {
        slug: "counting-challenge",
        title: "Count Master",
        description: "Count to 100 out loud without any mistakes!",
        icon: "🔢",
        difficulty: "easy",
        reward: 20,
        time_estimate: "15 minutes"
      },
      {
        slug: "puzzle-complete",
        title: "Puzzle Pro",
        description: "Complete a jigsaw puzzle by yourself. At least 50 pieces!",
        icon: "🧩",
        difficulty: "medium",
        reward: 30,
        time_estimate: "2 hours"
      },
      {
        slug: "science-question",
        title: "Wonder Asker",
        description: "Ask a 'why' or 'how' question about the world. Research the answer together!",
        instructions: "Think of something you're curious about:\n- Why is the sky blue?\n- How do planes fly?\n- Why do we dream?\n\nLook up the answer with a grown-up and explain what you learned!",
        icon: "🔬",
        difficulty: "medium",
        reward: 30,
        time_estimate: "1 hour"
      },
      {
        slug: "backwards-alphabet",
        title: "Alphabet Ace",
        description: "Say the alphabet backwards without looking!",
        icon: "🔤",
        difficulty: "hard",
        reward: 50,
        time_estimate: "1 week"
      },
      {
        slug: "memory-game",
        title: "Memory Champ",
        description: "Beat a family member at a memory matching game 3 times!",
        icon: "🃏",
        difficulty: "medium",
        reward: 30,
        time_estimate: "1 week"
      }
    ]
  }
];

export function getPack(slug: string): Pack | undefined {
  return PACKS.find(p => p.slug === slug);
}

export function getChallenge(packSlug: string, challengeSlug: string): Challenge | undefined {
  const pack = getPack(packSlug);
  if (!pack) return undefined;
  return pack.challenges.find(c => c.slug === challengeSlug);
}

export function getAllChallenges(): { challenge: Challenge; pack: Pack }[] {
  return PACKS.flatMap(pack => 
    pack.challenges.map(challenge => ({ challenge, pack }))
  );
}
