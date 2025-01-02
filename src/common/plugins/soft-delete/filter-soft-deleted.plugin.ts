import { SchemaOptions } from 'mongoose';
import { PipelineStage, Schema } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function filterSoftDeletePlugin(schema: Schema, options: SchemaOptions) {
  schema.pre(
    new RegExp(
      '^(find|count|countDocuments|estimatedDocumentCount|findOne|findOneAndDelete|findOneAndRemove|findOneAndReplace|findOneAndUpdate|remove|replaceOne|update|updateOne|updateMany)',
    ),
    function (next) {
      if (this.getFilter().deletedAt === undefined) {
        this.where('deletedAt').equals(null);
      }
      next();
    },
  );

  schema.pre('aggregate', function (next) {
    const searchStage = this.pipeline()?.[0]?.['$search'];
    const hasTextSearch = this.pipeline()?.[0]?.['$match']?.['$text'];

    if (!searchStage && !hasTextSearch) {
      this.pipeline().unshift({
        $match: {
          deletedAt: {
            $lte: null,
          },
        },
      });
    } else {
      this.pipeline().splice(1, 0, {
        $match: {
          deletedAt: {
            $lte: null,
          },
        },
      });
    }

    filterSoftDeletedDocsInAggregationLookupRecursively(this.pipeline());

    next();
  });
}

export function filterSoftDeletedDocsInAggregationLookupRecursively(pipeline: PipelineStage[]) {
  pipeline.forEach((stage: any) => {
    if ((stage as PipelineStage.Lookup).$lookup?.pipeline) {
      stage.$lookup.pipeline.unshift({
        $match: {
          $expr: {
            $lte: ['$deletedAt', null],
          },
        },
      });

      filterSoftDeletedDocsInAggregationLookupRecursively(stage.$lookup.pipeline);
    }
    if ((stage as PipelineStage.GraphLookup).$graphLookup) {
      stage.$graphLookup = {
        ...stage.$graphLookup,
        restrictSearchWithMatch: {
          ...stage.$graphLookup.restrictSearchWithMatch,
          deletedAt: null,
        },
      };
    }
  });
}
