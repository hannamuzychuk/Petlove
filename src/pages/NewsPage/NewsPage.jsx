import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getNews } from '../../services/newsApi';
import { startLoading, stopLoading } from '../../redux/loadingSlice';
import SearchField from '../../components/ui/Modal/SearchField/SearchField';
import Pagination from '../../components/ui/Pagination/Pagination';
import NewsList from '../../components/news/NewsList/NewsList';
import styles from './NewsPage.module.css';
import Title from '../../components/ui/Title/Title';
import Container from '../../components/ui/Container/Container';


const LIMIT = 6;

export default function NewsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(keyword);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setQuery(keyword);
  }, [keyword]);

  useEffect(() => {
    const loadNews = async () => {
      dispatch(startLoading());
      try {
        const data = await getNews({
          keyword,
          page,
          limit: LIMIT,
        });
        setItems(data.results ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to load news';
        toast.error(message);
        setItems([]);
        setTotalPages(0);
      } finally {
        dispatch(stopLoading());
      }
    };

    loadNews();
  }, [keyword, page, dispatch]);

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams);

    if (next.keyword !== undefined) {
      const value = next.keyword.trim();
      if (value) {
        params.set('keyword', value);
      } else {
        params.delete('keyword');
      }
    }

    if (next.page !== undefined) {
      if (next.page <= 1) params.delete('page');
      else params.set('page', String(next.page));
    }

    setSearchParams(params);
  };

  const handleSubmit = () => {
    updateParams({ keyword: query, page: 1 });
  };

  const handleClear = () => {
    setQuery('');
    updateParams({ keyword: '', page: 1 });
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage });
  };

  return (
    <div className={styles.page}>
      <Container>
        <div className={styles.header}>
          <Title>News</Title>
          <div className={styles.searchWrap}>
            <SearchField
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />
          </div>
        </div>
        <NewsList items={items} />
        <div className={styles.pagination}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </Container>
    </div>
  );
}
