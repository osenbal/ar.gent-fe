import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '.';
import { BACKEND_URL } from '@/config/config';
import IUser, {
  IEducation_User,
  IExperience_User,
  ILogin_User,
  IEdited_User,
} from '@interfaces/user.interface';

// Define a type for the slice state
interface AuthState {
  userId: string;
  isAuth: boolean;
  persist: boolean;
  isLoading: boolean;
  user: IUser | null;
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
      return { isAuth: false, userId: '' };
    }
  }
);

export const loginUser = createAsyncThunk(
  `auth/login`,
  async (payload: ILogin_User) => {
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
    setAboutUser: (state, action) => {
      state.user!.about = action.payload;
    },
    setSummaryUser: (state, action) => {
      state.user!.fullName = action.payload.fullName;
      state.user!.gender = action.payload.gender;
      state.user!.phoneNumber = action.payload.phoneNumber;
      state.user!.birthday = action.payload.birthday;
      state.user!.address.street = action.payload.street;
      state.user!.address.city = action.payload.city;
      state.user!.address.state = action.payload.state;
      state.user!.address.country = action.payload.country;
      state.user!.address.zipCode = action.payload.zipCode;
    },
    setAvatarUser: (state, action) => {
      state.user!.avatar = action.payload;
    },
    setBannerUser: (state, action) => {
      state.user!.banner = action.payload;
    },
    setCvUser: (state, action) => {
      state.user!.cv = action.payload;
    },
    setEducationUser: (state, action) => {
      state.user!.education = action.payload;
    },
    setExperienceUser: (state, action) => {
      state.user!.experience = action.payload;
    },
    setSkillUser: (state, action) => {
      state.user!.skill = action.payload;
    },
    setPortfolioUser: (state, action) => {
      state.user!.portfolioUrl = action.payload;
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
      state.userId = '';
    },
  },
});

export const {
  setUser,
  setIsAuth,
  setPersist,
  setIsLoading,
  setUserId,
  setAboutUser,
  setSummaryUser,
  setAvatarUser,
  setBannerUser,
  setCvUser,
  setEducationUser,
  setExperienceUser,
  setSkillUser,
  setPortfolioUser,
} = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
