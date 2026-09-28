export const marketing: Record<
  string,
  {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    image: string;
    sections: [string, string][];
  }
> = {
  "how-it-works": {
    title: "How Rewear works",
    description:
      "From outfit inspiration to your own version: upload a look, organize your closet, and recreate it with pieces you own.",
    eyebrow: "A SAVED LOOK IS JUST THE BEGINNING",
    heading: "See it. Save it. Rewear it.",
    image: "editorial",
    sections: [
      [
        "1. Bring a little inspiration",
        "Upload a screenshot or outfit photo as a JPG, PNG, or WebP. Crop to the look you want to recreate. Your first analysis can happen before you create an account.",
      ],
      [
        "2. Break the look down",
        "Rewear identifies visible garments, colors, and outfit details. AI can miss details, so treat attributes such as fit and material as estimates. No person is identified.",
      ],
      [
        "3. Find your own version",
        "Build your digital closet with a few pieces you love. Rewear compares each inspiration piece against your actual wardrobe using category, color, fit, pattern, style, and season.",
      ],
      [
        "4. Give it another day out",
        "Save an outfit, mark when you wear it, or share a result card. Your closet stays private, and you control every public link.",
      ],
    ],
  },
  "digital-closet": {
    title: "Digital closet — rediscover your wardrobe",
    description:
      "Create a private digital wardrobe. Add clothing photos, search by color and category, and organize the pieces you already own.",
    eyebrow: "YOUR NEW FAVORITE PLACE TO SHOP",
    heading: "Your wardrobe. A fresh perspective.",
    image: "flatlay",
    sections: [
      [
        "Start with your everyday pieces",
        "You don’t need an afternoon or a perfectly organized wardrobe. Begin with a top, a jacket, your favorite bottoms, and a pair of shoes. A small, accurate closet is more useful than a rushed catalog.",
      ],
      [
        "Give every piece a place",
        "Add a photo and choose a category, color, brand, fit, and style tags. Use favorites for the things you reach for most. Search brings the right piece back into view when you need it.",
      ],
      [
        "Import from the photos you already have",
        "With Rewear+, outfit photos can become suggested closet entries. Review the detected garments, correct their labels, and remove duplicates before adding anything.",
      ],
      [
        "Keep it yours",
        "Wardrobe images are private and served with temporary links. You can remove individual pieces, download your account data, or delete your account from Settings.",
      ],
    ],
  },
  "ai-outfit-recreator": {
    title: "AI outfit recreator — style your saved looks",
    description:
      "Upload outfit inspiration and recreate the look with your own clothes. Discover matching pieces and honest missing-item suggestions.",
    eyebrow: "FROM YOUR CAMERA ROLL TO YOUR CLOSET",
    heading: "That saved look has your name on it.",
    image: "inspiration",
    sections: [
      [
        "Understand what makes the outfit work",
        "A good reference is more than a shopping list. Rewear looks at visible garment categories, colors, silhouettes and style tags so you can understand the building blocks.",
      ],
      [
        "Match your wardrobe, not someone else’s",
        "Each suggested owned piece comes from your digital closet. If nothing fits the category closely enough, the result says it is missing instead of inventing a garment.",
      ],
      [
        "A match score is a guide",
        "The percentage is a weighted style-similarity estimate. It is not a promise of visual identity, physical fit, or how an outfit will look on you. Your judgment always comes first.",
      ],
      [
        "Save the idea for later",
        "Keep your recreated look in Saved outfits, organize it into a collection, and mark when you wear it. A good combination can become a reliable repeat.",
      ],
    ],
  },
  "outfit-planner": {
    title: "Outfit planner — save looks worth repeating",
    description:
      "Organize recreated outfits into collections, plan what to wear, and track your outfit history in your private wardrobe.",
    eyebrow: "GOOD OUTFITS DESERVE A REPEAT",
    heading: "Less deciding. More getting dressed.",
    image: "flatlay",
    sections: [
      [
        "Build a small rotation",
        "Save a few combinations that work for your routine. A work collection, a weekend collection, and a going-out collection are often enough to make daily decisions easier.",
      ],
      [
        "Keep the pieces connected",
        "A saved recreation records the inspiration and the pieces that matched it. Missing pieces stay clearly labeled so a good idea doesn’t get mistaken for a complete outfit.",
      ],
      [
        "Remember what you wore",
        "Use “Wore it today” to build an outfit history. Rewear celebrates repeating useful outfits instead of treating every day as a reason to buy something new.",
      ],
      [
        "Use your own taste",
        "A planner should make room for weather, comfort, and how you feel. Treat a saved look as a starting point and make it your own.",
      ],
    ],
  },
  "packing-list": {
    title: "Wardrobe packing list — travel with your own clothes",
    description:
      "Plan a trip capsule from your own digital wardrobe. Reuse versatile pieces and build a practical packing checklist with Rewear+.",
    eyebrow: "A SMALLER SUITCASE. MORE POSSIBILITIES.",
    heading: "Pack a little. Wear a lot.",
    image: "flatlay",
    sections: [
      [
        "Start with the trip",
        "Tell Rewear where you are going, how long you will stay, and which activities matter. Add your own weather context; the planner does not assume a live forecast.",
      ],
      [
        "Use a capsule you actually own",
        "Rewear+ builds suggestions from your saved wardrobe. Reusing a layer or pair of shoes is encouraged. Any gap is labeled separately from owned items.",
      ],
      [
        "Check the practical details",
        "Review the plan for dress codes, laundry, comfort, and changing weather. Tick pieces off while packing, and keep essentials such as documents and medicine on your own travel checklist.",
      ],
      [
        "Keep your favorites in rotation",
        "A travel capsule often reveals combinations worth repeating at home. Save the ideas you liked and bring them into your everyday wardrobe.",
      ],
    ],
  },
};
