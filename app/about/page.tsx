import AboutClient from "./AboutClient";

const BIO_PARAGRAPHS = [
  "Hi, I'm Navtej — a Computer Engineering graduate from Thapar University, Patiala, with a firm belief that having too many interests is a feature, not a bug.",
  "I've been a state-level badminton player, a table tennis regular, a fitness-first kind of person, and lately I've jumped onto the pickleball bandwagon too. If there's a racket involved, chances are I've tried it. Off the court, I'm the friend hunting down a great plate of butter chicken, trying yet another coffee bean, and making sure I never leave the house poorly dressed — or worse, poorly scented.",
  "That obsession with smelling good pulled me deeper into fragrances over the years — brands, notes, blends, bottles. As AI got genuinely good at helping people discover and understand products, I got curious what would happen if I pointed that at my own obsession instead of someone else's problem. Note Match is the answer.",
  "Think of me as a jack of all trades, master of adaptation — part engineer, part athlete, part fragrance nerd, and full-time curious about whatever's worth paying attention to next. If it smells great, feels interesting, or is something I haven't tried yet, I'm probably already looking into it.",
];

export default function AboutPage() {
  return <AboutClient paragraphs={BIO_PARAGRAPHS} />;
}
