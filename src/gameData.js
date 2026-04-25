export const CHAPTERS = [
  {
    id: 1, name: "Awakening",
    clocks: [
      {
        id: "1-1", title: "First Light", flavor: "The clock stirs from slumber.",
        no24cap: true, startSegment: 0,
        segments: [
          { label: "I", rules: [] },
          { label: "II", rules: [] },
          { label: "III", rules: [] },
          { label: "IV", rules: [] },
          { label: "V", rules: [] },
          { label: "VI", rules: [{ text: "Exactly 3 cards here", check: (cards) => cards.length === 3 }] },
        ]
      },
      {
        id: "1-2", title: "Morning Mist", flavor: "Shapes emerge from the fog.",
        no24cap: true, startSegment: 0,
        segments: [
          { label: "I", rules: [{ text: "Exactly 1 Solar card", check: (cards) => cards.filter(c => c.type === "solar").length === 1 }] },
          { label: "II", rules: [] },
          { label: "III", rules: [] },
          { label: "IV", rules: [] },
          { label: "V", rules: [] },
          { label: "VI", rules: [] },
        ]
      },
      {
        id: "1-3", title: "Ember Hours", flavor: "Warmth returns to the world.",
        no24cap: true, startSegment: 0,
        segments: [
          { label: "I", rules: [] },
          { label: "II", rules: [{ text: "Only Lunar cards", check: (cards) => cards.every(c => c.type === "lunar") }] },
          { label: "III", rules: [] },
          { label: "IV", rules: [] },
          { label: "V", rules: [{ text: "Only Solar cards", check: (cards) => cards.every(c => c.type === "solar") }] },
          { label: "VI", rules: [] },
        ]
      },
      {
        id: "1-4", title: "Full Dawn", flavor: "The clock stands fully revealed.",
        startSegment: 0,
        segments: [
          { label: "I", rules: [] },
          { label: "II", rules: [] },
          { label: "III", rules: [{ text: "Exactly 2 cards here", check: (cards) => cards.length === 2 }] },
          { label: "IV", rules: [] },
          { label: "V", rules: [] },
          { label: "VI", rules: [{ text: "Exactly 2 cards here", check: (cards) => cards.length === 2 }] },
        ]
      },
    ]
  },
  {
    id: 2, name: "Wandering",
    clocks: [
      {
        id: "2-1", title: "Crossroads", flavor: "Paths diverge in the mist.",
        startSegment: 0,
        segments: [
          { label: "I", rules: [{ text: "Exactly 1 card here", check: (cards) => cards.length === 1 }] },
          { label: "II", rules: [] },
          { label: "III", rules: [] },
          { label: "IV", rules: [{ text: "Exactly 1 card here", check: (cards) => cards.length === 1 }] },
          { label: "V", rules: [] },
          { label: "VI", rules: [] },
        ]
      },
      {
        id: "2-2", title: "Twin Moons", flavor: "Two lights guide the way.",
        startSegment: 0,
        clockRule: { text: "No segment may have more than 2 cards", check: (segments) => segments.every(s => s.length <= 2) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "2-3", title: "The Divide", flavor: "Sun and moon stand opposed.",
        startSegment: 0,
        segments: [
          { label: "I", rules: [{ text: "Only Solar cards", check: (cards) => cards.every(c => c.type === "solar") }] },
          { label: "II", rules: [] },
          { label: "III", rules: [{ text: "Only Lunar cards", check: (cards) => cards.every(c => c.type === "lunar") }] },
          { label: "IV", rules: [{ text: "Only Solar cards", check: (cards) => cards.every(c => c.type === "solar") }] },
          { label: "V", rules: [] },
          { label: "VI", rules: [{ text: "Only Lunar cards", check: (cards) => cards.every(c => c.type === "lunar") }] },
        ]
      },
      {
        id: "2-4", title: "Long Road", flavor: "Every step is deliberate.",
        startSegment: 0,
        clockRule: { text: "At least one segment must have value ≥ 20", check: (segments) => segments.some(s => s.reduce((a, c) => a + c.value, 0) >= 20) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] },
          { label: "VI", rules: [{ text: "Exactly 3 cards here", check: (cards) => cards.length === 3 }] },
        ]
      },
    ]
  },
  {
    id: 3, name: "Reflection",
    clocks: [
      {
        id: "3-1", title: "Mirror Lake", flavor: "What you see is reversed.",
        startSegment: 2,
        clockRule: { text: "Segments I–III: all Lunar · Segments IV–VI: all Solar", check: (segments) => segments.slice(0, 3).every(s => s.every(c => c.type === "lunar")) && segments.slice(3).every(s => s.every(c => c.type === "solar")) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "3-2", title: "Echo Chamber", flavor: "The same notes repeat.",
        startSegment: 0,
        clockRule: { text: "Each segment must have the same number of cards", check: (segments) => { const l = segments[0].length; return segments.every(s => s.length === l); } },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "3-3", title: "Inner Compass", flavor: "Trust your instincts.",
        startSegment: 1,
        segments: [
          { label: "I", rules: [{ text: "Exactly 1 Lunar card", check: (cards) => cards.filter(c => c.type === "lunar").length === 1 }] },
          { label: "II", rules: [] },
          { label: "III", rules: [{ text: "Exactly 2 cards", check: (cards) => cards.length === 2 }] },
          { label: "IV", rules: [] },
          { label: "V", rules: [{ text: "Exactly 1 Solar card", check: (cards) => cards.filter(c => c.type === "solar").length === 1 }] },
          { label: "VI", rules: [] },
        ]
      },
      {
        id: "3-4", title: "Still Waters", flavor: "Calm prevails at last.",
        startSegment: 3,
        clockRule: { text: "No two adjacent segments may have the same value", check: (segments) => { const vals = segments.map(s => s.reduce((a, c) => a + c.value, 0)); return vals.every((v, i) => v !== vals[(i + 1) % 6]); } },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
    ]
  },
  {
    id: 4, name: "Tempest",
    clocks: [
      {
        id: "4-1", title: "Storm Front", flavor: "The sky darkens with intent.",
        startSegment: 0,
        clockRule: { text: "Each segment must contain at least 1 Lunar card", check: (segments) => segments.every(s => s.some(c => c.type === "lunar")) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "4-2", title: "Thunder & Grace", flavor: "Chaos and order in balance.",
        startSegment: 0,
        segments: [
          { label: "I", rules: [{ text: "Value must be odd", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 1 }] },
          { label: "II", rules: [{ text: "Value must be even", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 0 }] },
          { label: "III", rules: [{ text: "Value must be odd", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 1 }] },
          { label: "IV", rules: [{ text: "Value must be even", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 0 }] },
          { label: "V", rules: [{ text: "Value must be odd", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 1 }] },
          { label: "VI", rules: [{ text: "Value must be even", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 0 }] },
        ]
      },
      {
        id: "4-3", title: "Eye of the Storm", flavor: "Stillness at the center.",
        startSegment: 2,
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] },
          { label: "III", rules: [{ text: "Exactly 1 card here", check: (cards) => cards.length === 1 }] },
          { label: "IV", rules: [{ text: "Exactly 1 card here", check: (cards) => cards.length === 1 }] },
          { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "4-4", title: "After the Rain", flavor: "Clarity follows chaos.",
        startSegment: 0,
        clockRule: { text: "At least 3 segments must contain only 1 card", check: (segments) => segments.filter(s => s.length === 1).length >= 3 },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] },
          { label: "VI", rules: [{ text: "Value must be exactly 24", check: (cards) => cards.reduce((a, c) => a + c.value, 0) === 24 }] },
        ]
      },
    ]
  },
  {
    id: 5, name: "Passage",
    clocks: [
      {
        id: "5-1", title: "The Gate", flavor: "You stand before the threshold.",
        startSegment: 0,
        clockRule: { text: "Each segment must contain at least 1 Solar card", check: (segments) => segments.every(s => s.some(c => c.type === "solar")) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "5-2", title: "Narrow Path", flavor: "Only the precise may pass.",
        startSegment: 1,
        segments: [
          { label: "I", rules: [{ text: "Value between 5 and 10", check: (cards) => { const v = cards.reduce((a, c) => a + c.value, 0); return v >= 5 && v <= 10; } }] },
          { label: "II", rules: [] },
          { label: "III", rules: [{ text: "Value between 10 and 15", check: (cards) => { const v = cards.reduce((a, c) => a + c.value, 0); return v >= 10 && v <= 15; } }] },
          { label: "IV", rules: [] },
          { label: "V", rules: [{ text: "Value between 15 and 20", check: (cards) => { const v = cards.reduce((a, c) => a + c.value, 0); return v >= 15 && v <= 20; } }] },
          { label: "VI", rules: [] },
        ]
      },
      {
        id: "5-3", title: "Halfway", flavor: "The journey is half complete.",
        startSegment: 3,
        clockRule: { text: "Total of all cards must be between 55 and 65", check: (segments) => { const t = segments.flat().reduce((a, c) => a + c.value, 0); return t >= 55 && t <= 65; } },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "5-4", title: "The Crossing", flavor: "Risk and resolve intertwined.",
        startSegment: 0,
        segments: [
          { label: "I", rules: [] },
          { label: "II", rules: [{ text: "At least 1 Solar and 1 Lunar card", check: (cards) => cards.some(c => c.type === "solar") && cards.some(c => c.type === "lunar") }] },
          { label: "III", rules: [] },
          { label: "IV", rules: [] },
          { label: "V", rules: [{ text: "At least 1 Solar and 1 Lunar card", check: (cards) => cards.some(c => c.type === "solar") && cards.some(c => c.type === "lunar") }] },
          { label: "VI", rules: [] },
        ]
      },
    ]
  },
  {
    id: 6, name: "Depths",
    clocks: [
      {
        id: "6-1", title: "The Abyss", flavor: "Darkness holds its secrets.",
        startSegment: 0,
        clockRule: { text: "All cards must be Lunar", check: (segments) => segments.flat().every(c => c.type === "lunar") },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "6-2", title: "Pressure", flavor: "Everything bears weight here.",
        startSegment: 2,
        clockRule: { text: "No segment may have value below 8", check: (segments) => segments.every(s => s.reduce((a, c) => a + c.value, 0) >= 8) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "6-3", title: "Undertow", flavor: "Pulled in many directions.",
        startSegment: 0,
        segments: [
          { label: "I", rules: [{ text: "Exactly 3 cards here", check: (cards) => cards.length === 3 }] },
          { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [{ text: "Exactly 3 cards here", check: (cards) => cards.length === 3 }] },
          { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "6-4", title: "Surfacing", flavor: "A glimmer from below.",
        startSegment: 5,
        clockRule: { text: "Exactly 6 Solar and 6 Lunar cards must be placed", check: (segments) => { const all = segments.flat(); return all.filter(c => c.type === "solar").length === 6 && all.filter(c => c.type === "lunar").length === 6; } },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
    ]
  },
  {
    id: 7, name: "Ascent",
    clocks: [
      {
        id: "7-1", title: "First Steps", flavor: "The mountain invites.",
        startSegment: 0,
        clockRule: { text: "Values must strictly increase (no ties)", check: (segments) => { const vals = segments.map(s => s.reduce((a, c) => a + c.value, 0)); return vals.every((v, i) => i === 0 || v > vals[i - 1]); } },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "7-2", title: "Ridge Walk", flavor: "Balance is everything.",
        startSegment: 3,
        segments: [
          { label: "I", rules: [{ text: "Value must be odd", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 1 }] },
          { label: "II", rules: [] },
          { label: "III", rules: [{ text: "Value must be odd", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 1 }] },
          { label: "IV", rules: [] },
          { label: "V", rules: [{ text: "Value must be odd", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 1 }] },
          { label: "VI", rules: [] },
        ]
      },
      {
        id: "7-3", title: "Summit Approach", flavor: "The peak is near.",
        startSegment: 0,
        clockRule: { text: "At least 4 segments must have value ≥ 12", check: (segments) => segments.filter(s => s.reduce((a, c) => a + c.value, 0) >= 12).length >= 4 },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] }, { label: "IV", rules: [] },
          { label: "V", rules: [{ text: "Exactly 1 card here", check: (cards) => cards.length === 1 }] },
          { label: "VI", rules: [{ text: "Exactly 1 card here", check: (cards) => cards.length === 1 }] },
        ]
      },
      {
        id: "7-4", title: "The Peak", flavor: "The world spreads below.",
        startSegment: 4,
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] }, { label: "IV", rules: [] },
          { label: "V", rules: [{ text: "Only Solar cards", check: (cards) => cards.every(c => c.type === "solar") }] },
          { label: "VI", rules: [{ text: "Value must be exactly 24", check: (cards) => cards.reduce((a, c) => a + c.value, 0) === 24 }] },
        ]
      },
    ]
  },
  {
    id: 8, name: "Convergence",
    clocks: [
      {
        id: "8-1", title: "Gathering", flavor: "All paths lead here.",
        startSegment: 0,
        clockRule: { text: "No segment may have more than 3 cards", check: (segments) => segments.every(s => s.length <= 3) },
        segments: [
          { label: "I", rules: [{ text: "At least 2 cards here", check: (cards) => cards.length >= 2 }] },
          { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [{ text: "At least 2 cards here", check: (cards) => cards.length >= 2 }] },
          { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "8-2", title: "Alignment", flavor: "Stars and souls align.",
        startSegment: 2,
        clockRule: { text: "Each segment must contain both a Solar and a Lunar card", check: (segments) => segments.every(s => s.some(c => c.type === "solar") && s.some(c => c.type === "lunar")) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "8-3", title: "Momentum", flavor: "Each step builds the next.",
        startSegment: 0,
        segments: [
          { label: "I", rules: [{ text: "Value between 2 and 6", check: (cards) => { const v = cards.reduce((a, c) => a + c.value, 0); return v >= 2 && v <= 6; } }] },
          { label: "II", rules: [{ text: "Value between 6 and 10", check: (cards) => { const v = cards.reduce((a, c) => a + c.value, 0); return v >= 6 && v <= 10; } }] },
          { label: "III", rules: [{ text: "Value between 10 and 14", check: (cards) => { const v = cards.reduce((a, c) => a + c.value, 0); return v >= 10 && v <= 14; } }] },
          { label: "IV", rules: [{ text: "Value between 14 and 18", check: (cards) => { const v = cards.reduce((a, c) => a + c.value, 0); return v >= 14 && v <= 18; } }] },
          { label: "V", rules: [{ text: "Value between 18 and 22", check: (cards) => { const v = cards.reduce((a, c) => a + c.value, 0); return v >= 18 && v <= 22; } }] },
          { label: "VI", rules: [] },
        ]
      },
      {
        id: "8-4", title: "Union", flavor: "Separate no longer.",
        startSegment: 5,
        clockRule: { text: "All cards must be Solar", check: (segments) => segments.flat().every(c => c.type === "solar") },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
    ]
  },
  {
    id: 9, name: "Unraveling",
    clocks: [
      {
        id: "9-1", title: "Fraying Edges", flavor: "The familiar grows strange.",
        startSegment: 0,
        clockRule: { text: "No segment may have value above 18", check: (segments) => segments.every(s => s.reduce((a, c) => a + c.value, 0) <= 18) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] }, { label: "IV", rules: [] }, { label: "V", rules: [] },
          { label: "VI", rules: [{ text: "Exactly 2 cards: 1 Solar 1 Lunar", check: (cards) => cards.length === 2 && cards.some(c => c.type === "solar") && cards.some(c => c.type === "lunar") }] },
        ]
      },
      {
        id: "9-2", title: "Scatter", flavor: "Order collapses into possibility.",
        startSegment: 3,
        clockRule: { text: "Values strictly increase (no ties)", check: (segments) => { const vals = segments.map(s => s.reduce((a, c) => a + c.value, 0)); return vals.every((v, i) => i === 0 || v > vals[i - 1]); } },
        segments: [
          { label: "I", rules: [{ text: "Value must be even", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 0 }] },
          { label: "II", rules: [] },
          { label: "III", rules: [{ text: "Value must be even", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 0 }] },
          { label: "IV", rules: [] },
          { label: "V", rules: [{ text: "Value must be even", check: (cards) => cards.reduce((a, c) => a + c.value, 0) % 2 === 0 }] },
          { label: "VI", rules: [] },
        ]
      },
      {
        id: "9-3", title: "Dissolution", flavor: "What remains when all is stripped away?",
        startSegment: 1,
        clockRule: { text: "Exactly 2 cards in each segment", check: (segments) => segments.every(s => s.length === 2) },
        segments: [
          { label: "I", rules: [] },
          { label: "II", rules: [{ text: "Must include the Solar 12 or Lunar 12", check: (cards) => cards.some(c => c.value === 12) }] },
          { label: "III", rules: [] }, { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "9-4", title: "The Void", flavor: "Silence speaks volumes.",
        startSegment: 5,
        segments: [
          { label: "I", rules: [{ text: "Only Lunar cards; value ≥ 15", check: (cards) => cards.every(c => c.type === "lunar") && cards.reduce((a, c) => a + c.value, 0) >= 15 }] },
          { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [{ text: "Only Solar cards; value ≥ 15", check: (cards) => cards.every(c => c.type === "solar") && cards.reduce((a, c) => a + c.value, 0) >= 15 }] },
          { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
    ]
  },
  {
    id: 10, name: "Rebirth",
    clocks: [
      {
        id: "10-1", title: "New Horizon", flavor: "Something ancient begins again.",
        startSegment: 0,
        clockRule: { text: "Each segment: both Solar & Lunar; values strictly increase", check: (segments) => { const vals = segments.map(s => s.reduce((a, c) => a + c.value, 0)); return segments.every(s => s.some(c => c.type === "solar") && s.some(c => c.type === "lunar")) && vals.every((v, i) => i === 0 || v > vals[i - 1]); } },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "10-2", title: "Sacred Pattern", flavor: "The design reveals itself.",
        startSegment: 2,
        segments: [
          { label: "I", rules: [{ text: "Exactly 1 card; value must be 1", check: (cards) => cards.length === 1 && cards[0].value === 1 }] },
          { label: "II", rules: [] }, { label: "III", rules: [] }, { label: "IV", rules: [] }, { label: "V", rules: [] },
          { label: "VI", rules: [{ text: "Exactly 1 card; value must be 12", check: (cards) => cards.length === 1 && cards[0].value === 12 }] },
        ]
      },
      {
        id: "10-3", title: "The Weaving", flavor: "All threads intertwined.",
        startSegment: 5,
        clockRule: { text: "Segments alternate Solar-dominant / Lunar-dominant", check: (segments) => segments.every((s, i) => { const sol = s.filter(c => c.type === "solar").length; const lun = s.filter(c => c.type === "lunar").length; return i % 2 === 0 ? sol > lun : lun > sol; }) },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
      {
        id: "10-4", title: "Eternal Return", flavor: "The clock completes its revolution.",
        startSegment: 0,
        clockRule: { text: "Strictly increasing values · both types each segment · total 60–78", check: (segments) => { const vals = segments.map(s => s.reduce((a, c) => a + c.value, 0)); const total = vals.reduce((a, v) => a + v, 0); return vals.every((v, i) => i === 0 || v > vals[i - 1]) && segments.every(s => s.some(c => c.type === "solar") && s.some(c => c.type === "lunar")) && total >= 60 && total <= 78; } },
        segments: [
          { label: "I", rules: [] }, { label: "II", rules: [] }, { label: "III", rules: [] },
          { label: "IV", rules: [] }, { label: "V", rules: [] }, { label: "VI", rules: [] },
        ]
      },
    ]
  },
];

export function validateClock(clock, segments) {
  const errors = [];
  segments.forEach((seg, i) => {
    if (seg.length === 0) errors.push(`Segment ${clock.segments[i].label} has no cards`);
  });
  const vals = segments.map(seg => seg.reduce((a, c) => a + c.value, 0));
  const start = clock.startSegment || 0;
  const ordered = [...vals.slice(start), ...vals.slice(0, start)];
  for (let i = 1; i < ordered.length; i++) {
    if (ordered[i] < ordered[i - 1]) {
      errors.push(`Values must not decrease going clockwise (${clock.segments[(start + i - 1) % 6].label}→${clock.segments[(start + i) % 6].label})`);
    }
  }
  if (!clock.no24cap) {
    segments.forEach((seg, i) => {
      const v = seg.reduce((a, c) => a + c.value, 0);
      if (v > 24) errors.push(`Segment ${clock.segments[i].label} exceeds 24 (value: ${v})`);
    });
  }
  if (clock.clockRule && !clock.clockRule.check(segments)) errors.push(clock.clockRule.text);
  clock.segments.forEach((segDef, i) => {
    segDef.rules.forEach(rule => {
      if (!rule.check(segments[i])) errors.push(`Segment ${segDef.label}: ${rule.text}`);
    });
  });
  return errors;
}

export function generateDeck() {
  const cards = [];
  for (let v = 1; v <= 12; v++) {
    cards.push({ id: `s${v}`, value: v, type: "solar" });
    cards.push({ id: `l${v}`, value: v, type: "lunar" });
  }
  return cards;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function dealCards(playerCount) {
  const deck = shuffle(generateDeck());
  const hands = [];
  if (playerCount === 2) {
    hands.push({ main: deck.slice(0, 4), bonus: deck.slice(4, 6) });
    hands.push({ main: deck.slice(6, 10), bonus: deck.slice(10, 12) });
  } else if (playerCount === 3) {
    for (let i = 0; i < 3; i++) hands.push({ main: deck.slice(i * 4, i * 4 + 4), bonus: [] });
  } else {
    for (let i = 0; i < 4; i++) hands.push({ main: deck.slice(i * 3, i * 3 + 3), bonus: [] });
  }
  return hands;
}

export function genCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}
