export type Op = {
  kind: 'delete' | 'retain' | 'insert';
  content: string;
};

function getEditOps(
  str1: string,
  str2: string,
  compare: (a: string, b: string) => boolean = Object.is,
) {
  const from = Array.from(str1),
    to = Array.from(str2);
  const m = from.length,
    n = to.length;
  const dp = Array.from({ length: m + 1 }).map(
    () => Array.from({ length: n + 1 }).fill(0) as number[],
  );
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (compare(from[i - 1], to[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1);
      }
    }
  }

  let i = m,
    j = n;

  const ops: Op[] = from.map((s) => ({ kind: 'retain', content: s }));
  const adds = Array.from({ length: from.length + 1 }).fill('') as string[];
  while (i > 0 || j > 0) {
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops[i - 1].kind = 'delete';
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      adds[i] = to[j - 1] + adds[i];
      j--;
    } else {
      i--;
      j--;
    }
  }

  const res: Op[] = [];
  function addRes(op: Op) {
    if (res.length) {
      const last = res[res.length - 1];
      if (last.kind === op.kind) {
        last.content += op.content;
        return;
      }
    }
    res.push(op);
  }

  for (let i = 0; i <= m; i++) {
    if (adds[i]) {
      addRes({
        kind: 'insert',
        content: adds[i],
      });
    }
    if (i < ops.length) {
      addRes(ops[i]);
    }
  }

  return res;
}

export { getEditOps };
