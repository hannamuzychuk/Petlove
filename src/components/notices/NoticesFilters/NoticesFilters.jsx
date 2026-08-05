import { useEffect, useMemo, useRef, useState } from 'react';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/async';
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
  label: [city.cityEn, city.stateEn].filter(Boolean).join(', '),
});

const findOption = (options, value) =>
  options.find((option) => option.value === value) || null;

const highlightLabel = (label, query) => {
  if (!query) {
    return <span className={styles.locationMuted}>{label}</span>;
  }

  const index = label.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return <span className={styles.locationMuted}>{label}</span>;
  }

  return (
    <>
      {index > 0 ? (
        <span className={styles.locationMuted}>{label.slice(0, index)}</span>
      ) : null}
      <span className={styles.locationMatch}>
        {label.slice(index, index + query.length)}
      </span>
      <span className={styles.locationMuted}>
        {label.slice(index + query.length)}
      </span>
    </>
  );
};

const LocationDropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <Icon name="search" size={18} />
  </components.DropdownIndicator>
);

const LocationIndicatorsContainer = (props) => {
  const hasInput = Boolean(props.selectProps.inputValue?.trim());
  const showClear = props.hasValue || hasInput;

  return (
    <components.IndicatorsContainer {...props}>
      {showClear ? (
        <div
          role="button"
          tabIndex={-1}
          aria-label="Clear"
          className={styles.locationClear}
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            props.clearValue();
            props.selectProps.onInputChange('', { action: 'input-change' });
          }}
        >
          <Icon name="close-menu" size={18} />
        </div>
      ) : null}
      <LocationDropdownIndicator {...props} />
    </components.IndicatorsContainer>
  );
};

const LocationOption = (props) => {
  const query = props.selectProps.inputValue?.trim() || '';

  return (
    <components.Option {...props}>
      {highlightLabel(props.data.label, query)}
    </components.Option>
  );
};

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
  const locationSearchTimer = useRef(null);
  const locationSearchResolve = useRef(null);
  const locationOptionsRef = useRef([]);

  const categoryOptions = useMemo(
    () => toFilterOptions(categories),
    [categories],
  );
  const genderOptions = useMemo(() => toFilterOptions(sexOptions), [sexOptions]);
  const typeOptions = useMemo(
    () => toFilterOptions(speciesOptions),
    [speciesOptions],
  );
  const locationSelectOptions = useMemo(
    () => locationOptions.map(mapCity),
    [locationOptions],
  );

  const resolvedFromFilters = filters.locationId
    ? locationSelectOptions.find(
        (option) => option.value === filters.locationId,
      ) || null
    : null;

  if (!filters.locationId && locationValue !== null) {
    setLocationValue(null);
  } else if (
    filters.locationId &&
    locationValue?.value !== filters.locationId &&
    resolvedFromFilters
  ) {
    setLocationValue(resolvedFromFilters);
  }

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesData, sexData, speciesData, locationsData] =
          await Promise.all([
            getCategories(),
            getSexOptions(),
            getSpeciesOptions(),
            getLocationOptions(),
          ]);
        setCategories(categoriesData ?? []);
        setSexOptions(sexData ?? []);
        setSpeciesOptions(speciesData ?? []);
        setLocationOptions(locationsData ?? []);
        locationOptionsRef.current = (locationsData ?? []).map(mapCity);
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

  useEffect(
    () => () => {
      if (locationSearchTimer.current) {
        clearTimeout(locationSearchTimer.current);
      }
      if (locationSearchResolve.current) {
        locationSearchResolve.current([]);
        locationSearchResolve.current = null;
      }
    },
    [],
  );

  const loadLocationOptions = (inputValue) => {
    const keyword = inputValue.trim().toLowerCase();
    if (keyword.length < 1) {
      return Promise.resolve([]);
    }

    if (locationSearchTimer.current) {
      clearTimeout(locationSearchTimer.current);
    }
    if (locationSearchResolve.current) {
      locationSearchResolve.current([]);
      locationSearchResolve.current = null;
    }

    return new Promise((resolve) => {
      locationSearchResolve.current = resolve;

      locationSearchTimer.current = setTimeout(() => {
        locationSearchResolve.current = null;
        resolve(
          locationOptionsRef.current.filter((option) =>
            option.label.toLowerCase().includes(keyword),
          ),
        );
      }, 200);
    });
  };

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
          <AsyncSelect
            unstyled
            classNamePrefix="location"
            placeholder="Location"
            isClearable
            defaultOptions={false}
            filterOption={null}
            loadOptions={loadLocationOptions}
            value={locationValue}
            onChange={(option) => {
              setLocationValue(option);
              onChange({ locationId: option?.value || '', page: 1 });
            }}
            noOptionsMessage={({ inputValue }) => {
              const value = inputValue.trim();
              if (!value) return 'Type to search';
              return 'No locations found';
            }}
            components={{
              IndicatorsContainer: LocationIndicatorsContainer,
              DropdownIndicator: () => null,
              ClearIndicator: () => null,
              Option: LocationOption,
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
