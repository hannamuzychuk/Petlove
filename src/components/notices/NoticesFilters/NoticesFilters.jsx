import { useEffect, useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import toast from 'react-hot-toast';

import Icon from '../../ui/Icon/Icon';
import SearchField from '../../ui/Modal/SearchField/SearchField';
import {
  getCategories,
  getSexOptions,
  getSpeciesOptions,
  getLocationOptions,
} from '../../../services/noticesApi';
import styles from './NoticesFilters.module.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'unpopular', label: 'Unpopular' },
  { value: 'cheap', label: 'Cheap' },
  { value: 'expensive', label: 'Expensive' },
];

const SHOW_ALL = { value: '', label: 'Show all' };

const capitalize = (value = '') =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

const toFilterOptions = (items = []) => [
  SHOW_ALL,
  ...items.map((item) => ({
    value: item,
    label: capitalize(item),
  })),
];

const mapCity = (city) => ({
  value: city._id,
  label: [city.stateEn, city.cityEn].filter(Boolean).join(', '),
});

const findOption = (options, value) =>
  options.find((option) => option.value === value) || null;

const LocationDropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <Icon name="search" size={18} />
  </components.DropdownIndicator>
);

const LocationClearIndicator = (props) => (
  <components.ClearIndicator {...props}>
    <Icon name="close-menu" size={18} />
  </components.ClearIndicator>
);

const FilterDropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <Icon name="chevron-down" width={11} height={6} />
  </components.DropdownIndicator>
);

export default function NoticesFilters({ filters, onChange }) {
  const [query, setQuery] = useState(filters.keyword || '');
  const [categories, setCategories] = useState([]);
  const [sexOptions, setSexOptions] = useState([]);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [locationValue, setLocationValue] = useState(null);

  const categoryOptions = useMemo(
    () => toFilterOptions(categories),
    [categories],
  );
  const genderOptions = useMemo(() => toFilterOptions(sexOptions), [sexOptions]);
  const typeOptions = useMemo(
    () => toFilterOptions(speciesOptions),
    [speciesOptions],
  );

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesData, sexData, speciesData, citiesData] =
          await Promise.all([
            getCategories(),
            getSexOptions(),
            getSpeciesOptions(),
            getLocationOptions(),
          ]);
        setCategories(categoriesData ?? []);
        setSexOptions(sexData ?? []);
        setSpeciesOptions(speciesData ?? []);
        setLocationOptions((citiesData ?? []).map(mapCity));
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to load filters';
        toast.error(message);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    if (!filters.locationId) {
      setLocationValue(null);
      return;
    }
    const found = locationOptions.find((o) => o.value === filters.locationId);
    if (found) setLocationValue(found);
  }, [filters.locationId, locationOptions]);

  const handleSubmit = () => {
    onChange({ keyword: query });
  };

  const handleClear = () => {
    setQuery('');
    onChange({ keyword: '' });
  };

  const handleSortClick = (value) => {
    onChange({ sort: filters.sort === value ? '' : value });
  };

  const handleFilterSelect = (key) => (option) => {
    onChange({ [key]: option?.value || '' });
  };

  const handleReset = () => {
    setQuery('');
    setLocationValue(null);
    onChange({
      keyword: '',
      category: '',
      sex: '',
      species: '',
      locationId: '',
      sort: '',
      page: 1,
    });
  };

  return (
    <div className={styles.filters}>
      <div className={styles.row}>
        <div className={styles.search}>
          <SearchField
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />
        </div>

        <div className={`${styles.filterSelect} ${styles.category}`}>
          <Select
            unstyled
            classNamePrefix="filter"
            placeholder="Category"
            isSearchable={false}
            options={categoryOptions}
            value={
              filters.category
                ? findOption(categoryOptions, filters.category)
                : null
            }
            onChange={handleFilterSelect('category')}
            components={{ DropdownIndicator: FilterDropdownIndicator }}
          />
        </div>

        <div className={`${styles.filterSelect} ${styles.gender}`}>
          <Select
            unstyled
            classNamePrefix="filter"
            placeholder="By gender"
            isSearchable={false}
            options={genderOptions}
            value={
              filters.sex ? findOption(genderOptions, filters.sex) : null
            }
            onChange={handleFilterSelect('sex')}
            components={{ DropdownIndicator: FilterDropdownIndicator }}
          />
        </div>

        <div className={`${styles.filterSelect} ${styles.type}`}>
          <Select
            unstyled
            classNamePrefix="filter"
            placeholder="By type"
            isSearchable={false}
            options={typeOptions}
            value={
              filters.species
                ? findOption(typeOptions, filters.species)
                : null
            }
            onChange={handleFilterSelect('species')}
            components={{ DropdownIndicator: FilterDropdownIndicator }}
            maxMenuHeight={216}
          />
        </div>

        <div className={styles.location}>
          <Select
            unstyled
            classNamePrefix="location"
            placeholder="Location"
            isClearable
            options={locationOptions}
            value={locationValue}
            onChange={(option) => {
              setLocationValue(option);
              onChange({ locationId: option?.value || '' });
            }}
            components={{
              DropdownIndicator: LocationDropdownIndicator,
              ClearIndicator: LocationClearIndicator,
            }}
          />
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <div className={styles.sort} role="group" aria-label="Sort">
          {SORT_OPTIONS.map(({ value, label }) => {
            const isActive = filters.sort === value;

            return (
              <button
                key={value}
                type="button"
                className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
                aria-pressed={isActive}
                onClick={() => handleSortClick(value)}
              >
                {label}
                {isActive ? (
                  <span
                    className={styles.chipClear}
                    role="presentation"
                    onClick={(event) => {
                      event.stopPropagation();
                      onChange({ sort: '' });
                    }}
                  >
                    <Icon name="close-menu" size={18} />
                  </span>
                ) : null}
              </button>
            );
          })}
          <button type="button" className={styles.reset} onClick={handleReset}>
            Reset
            <Icon name="close-menu" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
