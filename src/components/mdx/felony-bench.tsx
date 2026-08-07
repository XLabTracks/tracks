import bench from "@/content/felonybench.json";

/**
 * The FelonyBench incident table, printed from the imported artifact.
 *
 * `<FelonyBench />` in a lesson body. The data is
 * `src/content/felonybench.json`, written by `npm run felonybench:build` from
 * felonybench.com — so the table on the page is the table on the site as of
 * the retrieval date, and updating it is running the script, not editing
 * prose. The weekly workflow opens a pull request when the site has moved.
 *
 * The retrieval date prints under the table on purpose. This is somebody
 * else's running tally: the copy here is a snapshot the moment it is
 * committed, and a reader who cannot see how old it is has no way to know
 * whether the list simply stops or the incidents did.
 *
 * Trap: this renders inside `.lesson-body`, whose table rule puts wide tables
 * in their own scroll box — so the table must stay a plain <table> and must
 * not be wrapped in another overflow container, or it scrolls inside a box
 * inside a box.
 */
export function FelonyBench() {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Felonies</th>
            <th>Description</th>
            <th>Date</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {bench.incidents.map((i, n) => (
            <tr key={`${i.company}-${i.date}-${n}`}>
              <td>{i.company}</td>
              <td>{i.felonies}</td>
              <td>{i.description}</td>
              <td>{i.date}</td>
              <td>
                {i.sources.length
                  ? i.sources.map((s, k) => (
                      <span key={s.href}>
                        {k > 0 ? "; " : ""}
                        <a href={s.href} target="_blank" rel="noopener">
                          {s.label}
                        </a>
                      </span>
                    ))
                  : i.sourceText}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-muted-foreground text-sm">
        Imported from{" "}
        <a href={bench.source} target="_blank" rel="noopener">
          FelonyBench
        </a>{" "}
        on {bench.retrieved}; it keeps counting after that date.
      </p>
    </>
  );
}
