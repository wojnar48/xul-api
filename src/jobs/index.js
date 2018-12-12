const fetch = require('node-fetch');
const db = require('../db');

// TODO(SW): Move this into env variables and make URL construction into function
const HN_SEARCH_URL = 'http://hn.algolia.com/api/v1/search';

const dailyJobFinder = async () => {
  // Find all daily frequency filter jobs that should be run
  const jobs = await db.query.filterJobs({
    // Find all jobs that have a lastRun within 1 hour of now
    // TODO(SW): Change to days after results are confirmed
    where: {
      lastRun_lte: Date.now() - 3600000,
    }
  });

  if (jobs.length === 0) {
    console.log('No filter jobs found');
    return;
  }

  console.log(`Found ${jobs.length} jobs to process`);

  for (let job of jobs) {
    console.log(`Processing job.id=${job.id}`);
    // Get filter
    const [filter] = await db.query.filters(
      { where: { id: job.filter }},
      '{ id, name, filterTerms }'
    );

    // For each query term make a request to the HN API
    let results = {};

    for (let term of filter.filterTerms) {
      const response = await fetch(`${HN_SEARCH_URL}?query=${term}&tags=story&numericFilters=created_at_i>${job.lastRun / 1000},created_at_i<${Date.now() / 1000}`);
      const data = await response.json();

      if (data.hits.length > 0) {
        // If we found some hits, create FilterResult instances for each hit
        for (let hit of data.hits) {
          const filterResult = await db.mutation.createFilterResult({
            data: {
              url: hit.url || '',
              filter: {
                connect: {
                  id: filter.id,
                }
              }
            }
          });

          console.log(`Created filterResult.id=${filterResult.id}`);
        }
      }
    }
  }

  return;
};

module.exports = {
  dailyJobFinder,
};
