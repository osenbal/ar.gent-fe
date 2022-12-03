import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '.';
import { BACKEND_URL } from '@/config/config';
import IAdmin, {
  IAdminLogin,
  IAdminRegister,
} from '@/interfaces/admin.interface';

// Define a type for the slice state
interface AuthState {
  adminId: string;
  isAuth: boolean;
  isLoading: boolean;
  userAdmin: IAdmin | null;
}

const initialState: AuthState = {
  isAuth: false,
  isLoading: false,
  adminId: '',
  userAdmin: null,
};

export const asyncLogoutAdmin = createAsyncThunk(
  'authAdmin/asyncLogoutAdmin',
  async (payload) => {
    const res = await fetch(`${BACKEND_URL}/admin/logout`, {
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

export const registerAdmin = createAsyncThunk(
  'authAdmin/asyncRegister',
  async (payload: IAdminRegister) => {
    const res = await fetch(`${BACKEND_URL}/admin`, {
      method: 'POST',
      body: JSON.stringify(payload),
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
      return { isAuth: true, adminId: data.adminId };
    } else {
      toast.error(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { isAuth: false, adminId: '' };
    }
  }
);

export const loginAdmin = createAsyncThunk(
  `authAdmin/asyncLogin`,
  async (payload: IAdminLogin) => {
    const res = await fetch(`${BACKEND_URL}/admin/login`, {
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
      return { isAuth: true, adminId: data.data.adminId };
    } else {
      toast.error(`${data.message}`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return { isAuth: false };
    }
  }
);

export const authAdminSlice = createSlice({
  name: 'authAdmin',
  initialState,
  reducers: {
    setUserAdmin: (state, action) => {
      state.userAdmin = action.payload;
    },
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setAdminId: (state, action) => {
      state.adminId = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: {
    [registerAdmin.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [registerAdmin.fulfilled.type]: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.userAdmin = payload.adminId;
      state.isLoading = false;
    },
    [loginAdmin.pending.type]: (state, { payload }) => {
      state.isLoading = true;
    },
    [loginAdmin.fulfilled.type]: (state, { payload }) => {
      state.isAuth = payload.isAuth;
      state.adminId = payload.adminId;
      state.isLoading = false;
    },
    [asyncLogoutAdmin.fulfilled.type]: (state, { payload }) => {
      state.isLoading = false;
      state.isAuth = false;
      state.userAdmin = null;
      state.adminId = '';
    },
  },
});

export const { setUserAdmin, setIsAuth, setIsLoading, setAdminId } =
  authAdminSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authAdminSlice.reducer;
