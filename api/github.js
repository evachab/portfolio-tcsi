export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  try {
    const response = await fetch('https://api.github.com/users/evachab/repos?sort=updated&per_page=6', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-eva-chabert',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API: ${response.status}`);
    }

    const repos = await response.json();

    const data = repos
      .filter(r => !r.fork)
      .map(r => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
        updatedAt: r.updated_at,
      }));

    return res.status(200).json(data);
  } catch (err) {
    console.error('GitHub fetch error:', err);
    return res.status(500).json({ message: 'Impossible de charger les projets.' });
  }
}
