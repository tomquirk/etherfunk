const RenderResult = ({ result }: { result: any }) => {
  if (Array.isArray(result)) {
    return (
      <div>
        {result.map((r, i) => (
          <div key={i}>{r}</div>
        ))}
      </div>
    );
  }
  console.log(result);
  if (
    typeof result === "string" ||
    typeof result === "number" ||
    typeof result === "boolean"
  ) {
    return <div>{`${result}`}</div>;
  }

  return null;
};

export function ResultCard({ result }: { result: any }) {
  return (
    <div className="">
      <h3 className="text-lg font-medium text-slate-900 mb-2">Result</h3>
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
        <RenderResult result={result} />
      </div>
    </div>
  );
}
