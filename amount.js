export default async function handler(req, res) {
  try {
    const response = await fetch('https://soreosu.com/projects/youmenosay', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Upstream error' });
    }

    const html = await response.text();

    const match = html.match(
      /<div class="current-amount">[\s\S]*?<span[^>]*class="font-amount"[^>]*>(¥[\d,]+)<\/span>/
    );

    if (!match) {
      return res.status(404).json({ error: 'Amount not found' });
    }

    const amount = parseInt(match[1].replace('¥', '').replace(/,/g, ''), 10);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.json({ amount, fetchedAt: new Date().toISOString() });
  } catch {
    res.status(500).json({ error: 'Internal error' });
  }
}
