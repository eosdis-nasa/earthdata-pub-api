const sql = require('./sql-builder.js');
const { InvalidOrderByError } = sql;

function selectSql(options) {
  return sql.select(options);
}

describe('InvalidOrderByError export', () => {
  it('exports the error class without adding it to the query-type table', () => {
    expect(typeof sql.InvalidOrderByError).toBe('function');
    expect(new sql.InvalidOrderByError() instanceof Error).toBe(true);
    expect(() => sql.select({ fields: [{ type: 'InvalidOrderByError' }] })).toThrow(TypeError);
  });
});

describe('orderByClause via select', () => {
  it('omits ORDER BY when sort is omitted', () => {
    expect(selectSql({ from: { base: 'edpuser' } })).not.toMatch(/ORDER BY/);
  });

  it('treats empty sort= as omitted', () => {
    expect(selectSql({ from: { base: 'edpuser' }, sort: '' })).not.toMatch(/ORDER BY/);
  });

  it('ignores order without sort so first-load list queries keep working', () => {
    expect(selectSql({ from: { base: 'edpuser' }, order: 'DESC' })).not.toMatch(/ORDER BY/);
    expect(selectSql({ from: { base: 'edpuser' }, sort: '', order: 'DESC' })).not.toMatch(/ORDER BY/);
  });

  it('rebuilds ORDER BY from validated tokens', () => {
    const query = selectSql({ from: { base: 'edpuser' }, sort: 'name', order: 'desc' });
    expect(query).toMatch(/ORDER BY name DESC/);
  });

  it('applies a separate order only to the last column', () => {
    const query = selectSql({
      from: { base: 'submission' },
      sort: 'status, created_at',
      order: 'DESC'
    });
    expect(query).toMatch(/ORDER BY status, created_at DESC/);
    expect(query).not.toMatch(/ORDER BY status DESC/);
  });

  it('keeps inline directions per column', () => {
    const query = selectSql({
      from: { base: 'edpuser' },
      sort: 'name ASC, last_login DESC'
    });
    expect(query).toMatch(/ORDER BY name ASC, last_login DESC/);
  });

  it('rejects a separate order when sort already has an inline direction', () => {
    expect(() => selectSql({
      from: { base: 'edpuser' },
      sort: 'name ASC',
      order: 'DESC'
    })).toThrow(InvalidOrderByError);
  });

  it('rejects empty comma-separated entries', () => {
    expect(() => selectSql({ from: { base: 'edpuser' }, sort: 'created_at,,' }))
      .toThrow(InvalidOrderByError);
    expect(() => selectSql({ from: { base: 'edpuser' }, sort: ',name' }))
      .toThrow(InvalidOrderByError);
  });

  it('rejects injection payloads, quoted identifiers, expressions, and NULLS LAST', () => {
    const payloads = [
      'id;select pg_sleep(3)--',
      'name ASC; DROP TABLE edpuser',
      '"name"',
      'LOWER(name)',
      'created_at NULLS LAST',
      'a.b.c',
      '(CASE WHEN (substring((SELECT refresh_token FROM edpuser LIMIT 1),1,1)=\'a\') THEN id ELSE 1/0 END)',
      '(SELECT 1 FROM pg_sleep(5))',
      'id; DROP TABLE edpuser; --',
      'random()',
      'lower(name)',
      'CASE WHEN 1=1 THEN id ELSE name END',
      'name) ASC, (SELECT 1',
      'name/**/ASC',
      'pg_sleep(5)',
      'id||pg_sleep(1)',
      'id, pg_sleep(1)',
      'name;select pg_sleep(1)',
      'name\'%20OR%201=1',
      '1 UNION SELECT refresh_token FROM edpuser'
    ];
    payloads.forEach((sort) => {
      expect(() => selectSql({ from: { base: 'edpuser' }, sort }))
        .toThrow(InvalidOrderByError);
    });
  });

  it('rejects injected order values', () => {
    const orders = ['ASC;select 1', 'DESC; DROP TABLE edpuser; --', 'down', 'ASC DESC', '1'];
    orders.forEach((order) => {
      expect(() => selectSql({ from: { base: 'edpuser' }, sort: 'name', order }))
        .toThrow(InvalidOrderByError);
    });
  });

  it('maps allowlisted keys to application-owned columns', () => {
    const query = selectSql({
      from: { base: 'submission' },
      sort: 'status_message, created_at',
      order: 'DESC',
      sort_columns: {
        status_message: 'step.status',
        created_at: 'submission.created_at'
      }
    });
    expect(query).toMatch(/ORDER BY step\.status, submission\.created_at DESC/);
  });

  it('rejects unknown sort keys when an allowlist is present', () => {
    expect(() => selectSql({
      from: { base: 'edpuser' },
      sort: 'refresh_token',
      sort_columns: { name: 'edpuser.name' }
    })).toThrow(InvalidOrderByError);
  });
});

describe('json_agg and json_merge_agg ORDER BY', () => {
  it('rebuilds trusted identifier sorts', () => {
    const query = sql.json_agg({
      src: 'edpuser.name',
      sort: 'edpuser.name',
      order: 'ASC'
    });
    expect(query).toMatch(/ORDER BY edpuser\.name ASC/);
  });

  it('omits ORDER BY when both sort and order are omitted', () => {
    expect(sql.json_agg({ src: 'edpuser.name' })).not.toMatch(/ORDER BY/);
  });

  it('rejects injection in json_agg ORDER BY', () => {
    expect(() => sql.json_agg({
      src: 'edpuser.name',
      sort: '(SELECT 1 FROM pg_sleep(5))',
      order: 'ASC'
    })).toThrow(InvalidOrderByError);
  });
});
