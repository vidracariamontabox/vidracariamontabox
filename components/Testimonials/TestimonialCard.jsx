"use client";
import Image from "next/image";

export default function TestimonialCard({item}) {
  return (
    <article className="testimonial-item">
      <span className="testimonial-item__company mobile-only">{item.reviewType}</span>

      <div className="testimonial-item__body">
        <h3 className="testimonial-item__quote">{item.quoteMessage}</h3>

        <div className="testimonial-item__footer">
          <div className="testimonial-item__client">
            <div className="testimonial-item__avatar">
              <Image src={item.clientImage} alt={item.reviewType} fill sizes="80px" className="object-cover" />
            </div>

            <div className="testimonial-item__meta">
              <p className="testimonial-item__name">{item.clientName}</p>
              <p className="testimonial-item__deg">{item.clientDeg}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
