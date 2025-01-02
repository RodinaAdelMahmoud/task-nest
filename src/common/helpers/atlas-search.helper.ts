import { IBaseSearchIndex } from '@common/interfaces/atlas-search/index';
import { PipelineStage } from 'mongoose';

function getFuzzyMaxEdits(search: string) {
  if (search.length < 3) {
    return 0;
  }
  if (search.length < 5) {
    return 1;
  }
  return 2;
}

export function addSearchPipeLineStages(search: string, schema: IBaseSearchIndex): PipelineStage[] {
  if (!search) {
    return [];
  }

  const fuzzyMaxEdits = getFuzzyMaxEdits(search);

  const textSearchQuery = schema.paths.map((path) => {
    return {
      text: {
        query: search,
        path: path.path,
        fuzzy: {
          maxEdits: fuzzyMaxEdits,
        },
        score: {
          boost: {
            value: path.weight,
          },
        },
      },
    };
  });

  const textSearchBoostQuery = schema.paths.map((path) => {
    return {
      text: {
        query: search,
        path: path.path,
        fuzzy: {
          maxEdits: fuzzyMaxEdits,
          prefixLength: 3,
        },
        score: {
          boost: {
            value: path.weight,
          },
        },
      },
    };
  });

  return [
    {
      $search: {
        index: schema.index,
        compound: {
          must: [],
          should: [...textSearchQuery, ...textSearchBoostQuery],
        },
      },
    },
  ];
}
