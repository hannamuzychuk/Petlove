import { useState } from 'react';
import SearchField from '../../components/ui/Modal/SearchField/SearchField';
import Pagination from '../../components/ui/Pagination/Pagination';

export default function NewsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  return (
    <div>
      <h1>News</h1>
      <SearchField
        value={query}
        onChange={setQuery}
        onSubmit={() => console.log('search:', query)}
        onClear={() => setQuery('')}
      />
      <Pagination page={page} totalPages={10} onChange={setPage} />
    </div>
  );
}
