import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '.';
import { BACKEND_URL } from '@/config/config';
import { IUserLogin, IUserType } from '@/interfaces/user.interface';

// Define a type for the slice state
interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  user: IUserType | null;
  userDetails: object;
  visited_user: object;
  visited_userDetails: object;
}

// Define the initial state using that type
const initialState: AuthState = {
  isAuth: false,
  isLoading: false,
  user: null,
  userDetails: {},
  visited_user: {},
  visited_userDetails: {},
};

export const asyncLogout = createAsyncThunk(
  'auth/asyncLogout',
  async (payload) => {
    const res = await fetch('http://localhost:5000/api/auth/logout', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    if (res.ok) {
      return { isAuth: false };
    } else {
      toast.error(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { isAuth: false };
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: FormData) => {
    const res = await fetch(`${BACKEND_URL}/auth/user/signup`, {
      method: 'POST',
      body: payload,
      headers: {
        Accept: 'application/form-data',
      },
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(`${data.message}`, {
        position: 'top-right',
        theme: 'dark',
      });
      return { isAuth: true };
    } else {
      toast.error(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { isAuth: false };
    }
  }
);

export const loginUser = createAsyncThunk(
  `${BACKEND_URL}/auth/login`,
  async (payload: IUserLogin) => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'applications/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      return { isAuth: true };
    } else {
      toast.error(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { isAuth: false };
    }
  }
);

export const asyncUser = createAsyncThunk('auth/asyncUser', async (payload) => {
  const res = await fetch('http://localhost:5000/api/auth/', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'applications/json',
    },
  });
  const data = await res.json();
  if (res.ok) {
    return { isAuth: true, user: data.user, details: data.details };
  } else {
    toast.error(`${data.message}`, {
      position: 'bottom-left',
      theme: 'dark',
    });
    return { isAuth: false, user: {}, details: {} };
  }
});

export const asyncUserSingle = createAsyncThunk(
  'auth/asyncUserSingle',
  async ({ id }: { id: string }) => {
    const res = await fetch(`${BACKEND_URL}/auth/user/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'applications/json',
      },
    });
    const data = await res.json();
    if (res.ok) {
      return { user: data.user, details: data.details };
    } else {
      toast.error(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { isAuth: false, user: {}, details: {} };
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
      // state.userDetails = action.payload.userDetails;
    },
  },
  extraReducers: {
    [asyncUser.fulfilled.type]: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.user = payload.user;
      state.userDetails = payload.details;
    },
    [asyncUserSingle.fulfilled.type]: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.user = payload.user;
      state.userDetails = payload.details;
      // state.visited_userDetails = payload.details;
      // state.visited_user = payload.user;
    },
    [registerUser.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled.type]: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.isLoading = false;
    },
    [loginUser.fulfilled.type]: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.isLoading = false;
    },
    [loginUser.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncLogout.fulfilled.type]: (state, { payload }) => {
      state.isLoading = false;
      state.isAuth = false;
      state.user = null;
      state.userDetails = {};
    },
  },
});

export const { setUser } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
