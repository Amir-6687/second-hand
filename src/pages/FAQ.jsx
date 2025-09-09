import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "Wie funktioniert der Versand?",
      answer: "Wir versenden mit DHL oder Hermes umweltfreundlich und plastikfrei. Die Standard-Lieferzeit beträgt 2-5 Werktage. Versandkosten: 4,90 € pauschal, ab 60 € Warenwert versandkostenfrei. Abholung in Bielefeld ist auf Anfrage möglich."
    },
    {
      question: "Welche Zahlungsmethoden akzeptiert ihr?",
      answer: "Du kannst bequem und sicher bezahlen mit PayPal (schnell, sicher, mit Käuferschutz), WERO (direktes europäisches Bezahlen, gebührenarm) oder Vorkasse (Banküberweisung)."
    },
    {
      question: "Kann ich meine Bestellung zurückgeben?",
      answer: "Ja, du hast 14 Tage Zeit zur Rückgabe (außer bei Kommissionsware, diese ist entsprechend gekennzeichnet). Bitte sende ungetragene Artikel in Originalzustand zurück. Bei Rückgabe trägst du die Rücksendekosten selbst."
    },
    {
      question: "Was sind Kommissionsartikel?",
      answer: "Kommissionsartikel sind Einzelstücke oder Produkte, die auf Kommissionsbasis eingestellt sind. Diese sind als solche gekennzeichnet. Bei Kommissionsware sind Rückgaben ausgeschlossen."
    },
    {
      question: "Wie kann ich euch kontaktieren?",
      answer: "Du erreichst uns per E-Mail unter info@thegrrrlsclub.de oder über unsere Website www.thegrrrlsclub.de. Wir antworten gerne auf deine Fragen!"
    },
    {
      question: "Gibt es eine Mindestbestellmenge?",
      answer: "Nein, es gibt keine Mindestbestellmenge. Du kannst auch einzelne Artikel bestellen."
    },
    {
      question: "Wie lange dauert die Bearbeitung meiner Bestellung?",
      answer: "Nach Zahlungseingang bearbeiten wir deine Bestellung so schnell wie möglich. Die Lieferzeit beträgt dann 2-5 Werktage."
    },
    {
      question: "Kann ich meine Bestellung stornieren?",
      answer: "Ja, du kannst deine Bestellung stornieren, solange sie noch nicht versandt wurde. Kontaktiere uns einfach per E-Mail."
    },
    {
      question: "Was passiert bei beschädigten Artikeln?",
      answer: "Falls ein Artikel beschädigt ankommt, kontaktiere uns bitte sofort mit Fotos. Wir ersetzen den Artikel kostenlos oder erstatten den vollen Kaufpreis."
    },
    {
      question: "Gibt es Rabatte oder Gutscheine?",
      answer: "Ja, wir bieten regelmäßig Rabatte und Gutscheine an. Folge uns auf Instagram @the_grrrls_club, um über aktuelle Angebote informiert zu bleiben."
    }
  ];

  return (
    <>
      <SEOHead
        title="FAQ - Häufig gestellte Fragen - The Grrrls Club"
        description="Antworten auf häufig gestellte Fragen zu Versand, Zahlung, Rückgabe und mehr bei The Grrrls Club"
        keywords="FAQ, Fragen, Versand, Zahlung, Rückgabe, Support, Hilfe"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Häufig gestellte Fragen (FAQ)
            </h1>
            
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-800">
                      {item.question}
                    </span>
                    {openItems[index] ? (
                      <FaChevronUp className="text-pink-500" />
                    ) : (
                      <FaChevronDown className="text-pink-500" />
                    )}
                  </button>
                  {openItems[index] && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-pink-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Weitere Fragen?
              </h2>
              <p className="text-gray-600 text-center mb-4">
                Du findest keine Antwort auf deine Frage? Kontaktiere uns gerne!
              </p>
              <div className="text-center">
                <a
                  href="mailto:info@thegrrrlsclub.de"
                  className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  E-Mail senden
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
