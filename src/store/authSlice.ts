import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '.';
import { BACKEND_URL } from '@/config/config';
import {
  IEducation,
  IUser,
  IUserDetailsType,
  IUserLogin,
} from '@interfaces/user.interface';

// Define a type for the slice state
interface AuthState {
  userId: string;
  isAuth: boolean;
  persist: boolean;
  isLoading: boolean;
  user: IUser | null;
  userDetails: IUserDetailsType | null;
  visited_user: object;
  visited_userDetails: object;
}

// Define the initial state using that type
const persistStorage = localStorage.getItem('persist');

const initialState: AuthState = {
  isAuth: false,
  persist: persistStorage !== null ? JSON.parse(persistStorage) : false,
  isLoading: false,
  userId: '',
  user: null,
  userDetails: null,
  visited_user: {},
  visited_userDetails: {},
};

export const asyncLogout = createAsyncThunk(
  'auth/asyncLogout',
  async (payload) => {
    const res = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
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
    const res = await fetch(`${BACKEND_URL}/user`, {
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
      return { isAuth: true, userId: data.userId };
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
  `auth/login`,
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
      return { isAuth: true, userId: data.data.userId };
    } else {
      toast.error(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { isAuth: false };
    }
  }
);

export const asyncUserEducation = createAsyncThunk(
  'auth/asyncUserEducation',
  async ({ userId, payload }: { userId: string; payload: IEducation[] }) => {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ education: payload }),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { education: payload };
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // state.userDetails = action.payload.userDetails;
    },
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setPersist: (state, action) => {
      state.persist = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // user profile
    setEducationUser: (state, action) => {
      state.user!.education = action.payload;
    },
  },
  extraReducers: {
    [registerUser.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled.type]: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.userId = payload.userId;
      state.isLoading = false;
    },
    [loginUser.fulfilled.type]: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.userId = payload.userId;
      state.isLoading = false;
    },
    [loginUser.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncLogout.fulfilled.type]: (state, { payload }) => {
      state.isLoading = false;
      state.isAuth = false;
      state.user = null;
      state.userDetails = null;
      state.userId = '';
    },
    // user profile
    [asyncUserEducation.fulfilled.type]: (state, { payload }) => {
      console.log(payload);
      state.user!.education = payload.education;
    },
  },
});

export const {
  setUser,
  setIsAuth,
  setPersist,
  setIsLoading,
  setUserId,
  setEducationUser,
} = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
