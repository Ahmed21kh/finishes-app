import React, { useContext } from 'react';
import { ConfigProvider, Flex, Layout, theme } from 'antd';
import RouterContainer from './routes/RouterContainer';
import { AppContext } from './context/AppContext';
import HeaderComponent from './components/HeaderComponent';
import SideBarComponent from './components/SideBarComponent';
import BreadcrumbComponent from './components/BreadcrumbComponent';
import 'react-phone-input-2/lib/style.css'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import "./App.css"
import ButtonComponent from './components/ButtonComponent';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const App: React.FC = () => {
  const navigate = useNavigate();
  const {themeMode , primaryColor } = useContext(AppContext);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  })

  const goBack = () =>{
    navigate(-1 );
  }

  return (
    <>
    <ToastContainer theme={'dark'}/>
    <QueryClientProvider client={queryClient}>
    <ConfigProvider
        direction='rtl'
        theme={{
          algorithm:themeMode == 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
          token:{
            colorPrimary:primaryColor,
          },
          components: {
            Layout:{
              siderBg:themeMode == 'light'?'#ffffff':'#141414',
              headerBg:themeMode == 'light'?'#ffffff':'#141414',
              colorFillContent:themeMode == 'light'?'#ffffff':'#141414',
              algorithm:true,
            },
            Menu:{
              colorPrimary:themeMode == 'light'?'#000':'#fff',
              // itemColor:'#fff',
              // // itemSelectedBg:'#ffe58f',
              itemSelectedBg:primaryColor,
              itemMarginBlock:12,
              itemSelectedColor:'#fff',
            },
            Button: {
              colorPrimary: primaryColor,
              algorithm:true,
            },
            Modal:{
              colorPrimary: primaryColor,
            },
            Spin:{
              colorPrimary: primaryColor,
            }
          },
        }}
      >

    <Layout className=' h-screen'>
        <SideBarComponent/>
      <Layout className=' h-full overflow-auto'>
        <HeaderComponent/>
        <Content
          style={{
            // margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            height:'100%',
            overflowY:'auto',
            direction: 'rtl',
          }}
          >
            <Flex justify="space-between" align="start">
            <BreadcrumbComponent/>
             <ButtonComponent type='primary' className=' flex flex-row-reverse' icon={<LeftOutlined/>} text='رجوع' onClick={()=>goBack()}/>
            </Flex>
          <RouterContainer/>
        </Content>
      </Layout>
    </Layout>
    </ConfigProvider>
    </QueryClientProvider>
    </>
  );
};

export default App;
