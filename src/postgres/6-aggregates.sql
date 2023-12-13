DROP AGGREGATE IF EXISTS jsonb_merge_agg(jsonb);

CREATE AGGREGATE jsonb_merge_agg(jsonb) (
  SFUNC = 'jsonb_concat',
  STYPE = JSONB,
  INITCOND = '{}'
);
