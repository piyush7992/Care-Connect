import { ShowerHead, Bike, BedDouble, User, Baby, Brain } from "lucide-react";
// JSON data for features
export const features = [
  {
    icon: <User className="h-6 w-6 text-emerald-400" />,
    title: "Nutrition & Healthy Eating",
    description:
      "Focuses on balanced diets, understanding food labels, and making healthy food choices.",
    details:
      "IntroductionNutrition is the foundation of good health. The food we eat directly impacts our energy levels, growth, immunity, and even mental well-being. A poor diet is linked to chronic diseases such as diabetes, obesity, heart disease, and even certain cancers. On the other hand, a balanced diet can improve our productivity, help us stay active, and enhance our quality of life. Nutrition is not just about calories—it’s about providing the body with the right mix of macronutrients (carbohydrates, proteins, and fats) and micronutrients (vitamins and minerals).Balanced Diet & Food Groups.A healthy plate typically includes:Carbohydrates (50–60%): Foods like rice, whole wheat, oats, and potatoes provide energy. Choosing whole grains over refined ones ensures better digestion and prevents sudden spikes in blood sugar.Proteins (15–20%): Sources include pulses, lentils, eggs, dairy, fish, and meat. Proteins are essential for building muscles, repairing tissues, and supporting immunity.Healthy Fats (20–25%): Nuts, seeds, olive oil, and fish provide good fats that are necessary for brain function and hormone balance.Fruits & Vegetables: These provide vitamins, minerals, and fiber that protect against diseases. Experts recommend at least five servings per day.Water: Often overlooked, but staying hydrated improves metabolism, digestion, and skin health.Micronutrients & Their Importance Micronutrients are needed in small amounts but play a huge role in maintaining health:Iron prevents anemia and fatigue.Calcium & Vitamin D strengthen bones.Vitamin A improves eyesight and immunity.Iodine prevents goiter.Deficiencies in these nutrients are common in many communities, leading to preventable health problems.Nutrition Across the LifespanNutritional needs change with age:Children require more protein and calcium for growth.Adolescents need iron (especially girls), protein, and energy to support rapid changes.Adults should focus on balanced portions and limiting excess sugar, salt, and fat.Elderly need nutrient-dense foods and adequate hydration, as appetite and absorption reduce with age.Preventing Malnutrition and Obesity.Malnutrition is not just about being underweight; it also includes being overweight due to poor-quality diets. ",
  },
  {
    icon: <Bike className="h-6 w-6 text-emerald-400" />,
    title: "Exercise & Fitness",
    description:
      "Promotes physical activity, regular exercise, and maintaining a healthy weight.",
    details: "",
  },
  {
    icon: <ShowerHead className="h-6 w-6 text-emerald-400" />,
    title: "Personal Hygiene & Sanitation",
    description:
      "Focuses on handwashing, dental care, and general cleanliness to prevent infections.",
    details: "",
  },
  {
    icon: <BedDouble className="h-6 w-6 text-emerald-400" />,
    title: "Reproductive & Sexual Health",
    description:
      "Includes family planning, sexual health education, and reproductive rights.",
    details: "",
  },
  {
    icon: <Brain className="h-6 w-6 text-emerald-400" />,
    title: "Mental Well-being",
    description:
      "Focuses on stress management, mental health awareness, and emotional support.",
    details: "",
  },
  {
    icon: <Baby className="h-6 w-6 text-emerald-400" />,
    title: "Maternal & Child Health",
    description:
      "Covers prenatal care, childbirth education, and child nutrition.",
    details: "",
  },
];

// JSON data for testimonials
export const testimonials = [
  {
    initials: "SP",
    name: "Sarah P.",
    role: "Patient",
    quote:
      "The video consultation feature saved me so much time. I was able to get medical advice without taking time off work or traveling to a clinic.",
  },
  {
    initials: "DR",
    name: "Dr. Robert M.",
    role: "Cardiologist",
    quote:
      "This platform has revolutionized my practice. I can now reach more patients and provide timely care without the constraints of a physical office.",
  },
  {
    initials: "JT",
    name: "James T.",
    role: "Patient",
    quote:
      "The credit system is so convenient. I purchased a package for my family, and we've been able to consult with specialists whenever needed.",
  },
];

// JSON data for credit system benefits
export const creditBenefits = [
  "Each consultation requires <strong class='text-emerald-400'>2 credits</strong> regardless of duration",
  "Credits <strong class='text-emerald-400'>never expire</strong> - use them whenever you need",
  "Monthly subscriptions give you <strong class='text-emerald-400'>fresh credits every month</strong>",
  "Cancel or change your subscription <strong class='text-emerald-400'>anytime</strong> without penalties",
];
