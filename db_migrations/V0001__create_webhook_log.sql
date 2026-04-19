CREATE TABLE IF NOT EXISTS webhook_log (
    id serial PRIMARY KEY,
    ts timestamptz DEFAULT now(),
    method text,
    headers jsonb,
    query_params text,
    body text
);