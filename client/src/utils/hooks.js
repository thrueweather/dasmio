import { useState, useEffect, useMemo, useCallback } from "react";
import _ from "underscore";

import * as path from "constants/routes";
import { UNAUTHORIZED } from "constants/index";

export const useActiveLink = (path) => {
  const [activeLink, setActiveLink] = useState(path);

  useEffect(() => {
    if (!activeLink || activeLink === path) return;

    setActiveLink(path);
  }, [path]);

  return [activeLink, setActiveLink];
};

export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  });
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
};

export const useDebounce = (value, delay) => {
  const [debauncedValue, setValue] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => {
      setValue(value);
    }, delay);

    return () => {
      clearTimeout(handle);
    };
  }, [value, delay]);

  return debauncedValue;
};

export const useInfiniteScroll = ({ delay, callback, skip }) => {
  const [isFetching, setIsFetching] = useState(false);

  const throttled = _.throttle((e) => handleScroll(e), delay);

  useEffect(() => {
    if (skip) return;

    const wrapper = document.getElementById("content");

    wrapper.addEventListener("scroll", throttled);

    return () => {
      wrapper.removeEventListener("scroll", throttled);
    };
  }, [skip]);

  useEffect(() => {
    if (!isFetching) return;

    callback();
  }, [isFetching]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - 300) {
      setIsFetching(true);
    }
  };

  return [isFetching, setIsFetching];
};

export const useQuery = (props) => {
  const { client, endpoint, variables, entity, fetchPolicy, router } = props;
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null,
  });
  const { loading, data, error } = state;

  const params = useMemo(() => ({ ...variables }), [variables]);

  const getData = useCallback(
    (incomingParams) => {
      setState({ ...state, loading: true });
      client
        .query({
          query: endpoint,
          variables: {
            ...params,
            ...incomingParams,
          },
          fetchPolicy: fetchPolicy || "no-cache",
        })
        .then((response) => {
          const items = response.data[entity];

          setState({ ...state, loading: false, data: items });
        })
        .catch((error) => {
          if (error.toString() !== UNAUTHORIZED) {
            router.push(path.SERVER_ERROR);
          }

          setState({ loading: false, data: null, error });
        });
    },
    [endpoint, params, fetchPolicy]
  );

  return { getData, loading, error, data };
};

export const useSelection = () => {
  const [selected, setSelect] = useState([]);
  const select = useCallback((id) => setSelect(id), [selected, setSelect]);

  return [selected, select];
};
