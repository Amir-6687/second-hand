const services = [
  {
    title: "Aufräumhilfe",
    description:
      "Professionelle Unterstützung beim Aufräumen und Organisieren.",
  },
  {
    title: "Alltagsbegleitung",
    description:
      "Begleitung und Unterstützung im Alltag für mehr Lebensqualität.",
  },
  {
    title: "Umzugsvorpacken",
    description: "Hilfe beim Vorbereiten und Packen für den Umzug.",
  },
  {
    title: "Gesellschaftlerin",
    description: "Gesellschaft leisten und soziale Kontakte fördern.",
  },
];

export default function Services() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">Unsere Dienstleistungen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(({ title, description }) => (
          <div
            key={title}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-700">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
