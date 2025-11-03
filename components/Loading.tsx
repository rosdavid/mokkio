"use client";

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex items-center gap-3">
        <div className="flex h-24 w-24 items-center justify-center">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="266.667"
            height="266.667"
            viewBox="0 0 200 200"
          >
            <path
              d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
              fill="#fff"
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-foreground">Mokkio</span>
      </div>
    </div>
  );
}
