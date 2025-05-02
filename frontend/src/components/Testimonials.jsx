import React from 'react';

const testimonials = [
  {
    name: 'Ирина Петрова',
    feedback: 'Отличный сервис! Наш тур в Турцию был организован безупречно. Всё чётко и по расписанию.',
  },
  {
    name: 'Алексей Смирнов',
    feedback: 'Очень доволен работой агентства. Персональный подход, гибкие условия и доброжелательность.',
  },
  {
    name: 'Мария Иванова',
    feedback: 'Спасибо за незабываемое путешествие! Удобный поиск туров и отличные предложения.',
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Отзывы наших клиентов</h2>
        <div className="space-y-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 text-left"
            >
              <p className="text-gray-700 italic">“{item.feedback}”</p>
              <p className="text-sm text-gray-500 mt-4 text-right">— {item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
