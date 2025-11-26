"use client";

export default function RecentUploads({ urls }: { urls: string[] }) {
  if (!urls.length) return null;

  const generateBigIndexes = (count: number) => {
    const big = [0];
    const jumps = [7, 5];
    for (let n = 1; n < count; n++) {
      big.push(big[n - 1] + jumps[(n - 1) % 2]);
    }
    return big;
  };

  const patternBig = generateBigIndexes(urls.length);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
      {[...urls]
        .sort(() => Math.random() - 0.5)
        .map((url, i) => {
          const isBig = patternBig.includes(i);

          return url ? (
            <div
              key={i}
              className={
                isBig
                  ? "rounded-3xl overflow-hidden md:col-span-2 md:row-span-2"
                  : "rounded-3xl overflow-hidden"
              }
            >
              <img
                src={url}
                alt={`Uploaded ${i + 1}`}
                className="size-full object-cover object-bottom hover:scale-110 duration-700 ease-out"
              />
            </div>
          ) : null;
        })}
    </div>
  );
}
