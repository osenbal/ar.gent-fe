import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '.';
import { BACKEND_URL } from '@/config/config';
import {
  IEducation,
  IExperience,
  IUser,
  IUserLogin,
  IUserUpdate,
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
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { education: payload };
    }
  }
);

export const asyncUserExperience = createAsyncThunk(
  'auth/asyncUserExperience',
  async ({ userId, payload }: { userId: string; payload: IExperience[] }) => {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ experience: payload }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });

      return { experience: payload };
    }
  }
);

export const asyncUserSkill = createAsyncThunk(
  'auth/asyncUserSkill',
  async ({ userId, payload }: { userId: string; payload: string[] }) => {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skill: payload }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { skill: payload };
    }
  }
);

export const asyncUserPortfolioUrl = createAsyncThunk(
  'auth/asyncUserPortfolioUrl',
  async ({ userId, payload }: { userId: string; payload: string[] }) => {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ portfolioUrl: payload }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { portfolioUrl: payload };
    }
  }
);

export const asyncUserAbout = createAsyncThunk(
  'auth/asyncUserAbout',
  async ({ userId, payload }: { userId: string; payload: string }) => {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ about: payload.trim() }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { about: payload.trim() };
    }
  }
);

export const asyncUserSummary = createAsyncThunk(
  'auth/asyncUserSummary',
  async ({ userId, payload }: { userId: string; payload: IUserUpdate }) => {
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });

      return { summary: payload };
    }
  }
);

export const asyncUserAvatar = createAsyncThunk(
  'auth/asyncUserAvatar',
  async ({ userId, payload }: { userId: string; payload: FormData }) => {
    const response = await fetch(
      `${BACKEND_URL}/user/upload/${userId}?type=avatar`,
      {
        method: 'PUT',
        credentials: 'include',
        body: payload,
      }
    );

    const data = await response.json();
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });

      return { avatar: data.data };
    }
  }
);

export const asyncUserBanner = createAsyncThunk(
  'auth/asyncUserBanner',
  async ({ userId, payload }: { userId: string; payload: FormData }) => {
    const response = await fetch(
      `${BACKEND_URL}/user/upload/${userId}?type=banner`,
      {
        method: 'PUT',
        credentials: 'include',
        body: payload,
      }
    );

    const data = await response.json();
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });

      return { banner: data.data };
    }
  }
);

export const asyncUserCv = createAsyncThunk(
  'auth/asyncUserCv',
  async ({ userId, payload }: { userId: string; payload: FormData }) => {
    const response = await fetch(
      `${BACKEND_URL}/user/uploadfile/${userId}?type=cv`,
      {
        method: 'PUT',
        credentials: 'include',
        body: payload,
      }
    );

    const data = await response.json();
    if (response.ok) {
      toast.success(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });

      return { cv: data.data };
    } else {
      toast.error(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });

      return { cv: data.data };
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
      state.userId = '';
    },
    // user profile
    [asyncUserEducation.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserEducation.fulfilled.type]: (state, { payload }) => {
      state.user!.education = payload.education;
      state.isLoading = false;
    },
    [asyncUserExperience.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserExperience.fulfilled.type]: (state, { payload }) => {
      state.user!.experience = payload.experience;
      state.isLoading = false;
    },
    [asyncUserSkill.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserSkill.fulfilled.type]: (state, { payload }) => {
      state.user!.skill = payload.skill;
      state.isLoading = false;
    },
    [asyncUserPortfolioUrl.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserPortfolioUrl.fulfilled.type]: (state, { payload }) => {
      state.user!.portfolioUrl = payload.portfolioUrl;
      state.isLoading = false;
    },
    [asyncUserAbout.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserAbout.fulfilled.type]: (state, { payload }) => {
      state.user!.about = payload.about;
      state.isLoading = false;
    },
    [asyncUserSummary.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserSummary.fulfilled.type]: (state, { payload }) => {
      console.log(payload);
      state.user!.fullName = payload.summary.fullName;
      state.user!.gender = payload.summary.gender;
      state.user!.phoneNumber = payload.summary.phoneNumber;
      state.user!.birthday = payload.summary.birthday;
      state.user!.address.street = payload.summary.street;
      state.user!.address.city = payload.summary.city;
      state.user!.address.state = payload.summary.state;
      state.user!.address.country = payload.summary.country;
      state.user!.address.zipCode = payload.summary.zipCode;
      state.isLoading = false;
    },
    [asyncUserAvatar.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserAvatar.fulfilled.type]: (state, { payload }) => {
      state.user!.avatar = payload.avatar;
      state.isLoading = false;
    },
    [asyncUserBanner.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserBanner.fulfilled.type]: (state, { payload }) => {
      state.user!.banner = payload.banner;
      state.isLoading = false;
    },
    [asyncUserCv.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [asyncUserCv.fulfilled.type]: (state, { payload }) => {
      state.user!.cv = payload.cv;
      state.isLoading = false;
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
