import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getNotices } from '../../services/noticesApi';
import { startLoading, stopLoading } from '../../redux/loadingSlice';
import Title from '../../components/ui/Title/Title';
import Container from '../../components/ui/Container/Container';
import Pagination from '../../components/ui/Pagination/Pagination';
import NoticesList from '../../components/notices/NoticesList/NoticesList';
import NoticesFilters from '../../components/notices/NoticesFilters/NoticesFilters';
import ModalNotice from '../../components/notices/ModalNotice/ModalNotice';
import { useSelector } from 'react-redux';
import ModalAttention from '../../components/ui/ModalAttention/ModalAttention';
import styles from './NoticesPage.module.css';

const LIMIT = 6;

export default function NoticesPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    sex: searchParams.get('sex') || '',
    species: searchParams.get('species') || '',
    locationId: searchParams.get('locationId') || '',
    sort: searchParams.get('sort') || '',
  };

  const page = Number(searchParams.get('page')) || 1;

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isAttentionOpen, setIsAttentionOpen] = useState(false);

  useEffect(() => {
    const loadNotices = async () => {
      dispatch(startLoading());
      try {
        const sortParams = {};
        if (filters.sort === 'popular') sortParams.byPopularity = false;
        if (filters.sort === 'unpopular') sortParams.byPopularity = true;
        if (filters.sort === 'cheap') sortParams.byPrice = true;
        if (filters.sort === 'expensive') sortParams.byPrice = false;

        const data = await getNotices({
          page,
          limit: LIMIT,
          keyword: filters.keyword,
          category: filters.category,
          sex: filters.sex,
          species: filters.species,
          locationId: filters.locationId,
          ...sortParams,
        });
        setItems(data.results ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to load notices';
        toast.error(message);
        setItems([]);
        setTotalPages(0);
      } finally {
        dispatch(stopLoading());
      }
    };

    loadNotices();
  }, [
    page,
    filters.keyword,
    filters.category,
    filters.sex,
    filters.species,
    filters.locationId,
    filters.sort,
    dispatch,
  ]);

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined) return;

      const normalized = String(value).trim();
      if (!normalized) params.delete(key);
      else params.set(key, normalized);
    });

    if (next.page === undefined) {
      params.delete('page');
    } else if (next.page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(next.page));
    }

    setSearchParams(params);
  };

  const handleFiltersChange = (patch) => {
    updateParams(patch);
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage });
  };

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLearnMore = (notice) => {
    if (!isAuthenticated) {
      setIsAttentionOpen(true);
      return;
    }
    setSelectedNotice(notice);
  };

  const handleCloseModal = () => {
    setSelectedNotice(null);
  };

  const handleRequireAuth = () => {
    setSelectedNotice(null);
    setIsAttentionOpen(true);
  };

  return (
    <div className={styles.page}>
      <Container>
        <Title className={styles.title}>Find your favorite pet</Title>
        <NoticesFilters filters={filters} onChange={handleFiltersChange} />
        <NoticesList
          items={items}
          onLearnMore={handleLearnMore}
          onRequireAuth={handleRequireAuth}
        />
        <div className={styles.pagination}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      </Container>

      <ModalNotice
        isOpen={Boolean(selectedNotice)}
        onClose={handleCloseModal}
        notice={selectedNotice}
        onRequireAuth={handleRequireAuth}
      />

      <ModalAttention
        isOpen={isAttentionOpen}
        onClose={() => setIsAttentionOpen(false)}
      />
    </div>
  );
}
