import React, { useEffect, useState } from "react";
import {
  StyleNavItem,
  StyleUserName,
  StyleUserProfileContainer,
} from "./index.style";
import { Popover, Avatar, Badge } from "antd";

import { BellOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../modules/user/store";
import { useHistory, useLocation } from "react-router-dom";
import { Row } from "antd";
import { userHost } from "../../modules/user/config/UserConfig";
import ModalUser from "../../modules/user/components/screens/EditProfile";

const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [user, setUser] = useState(useSelector(state => state.user.user));
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const notification = () => (
    <div>
      <p>Thông báo</p>
    </div>
  );

  const handleLogout = () => {
    dispatch(actions.setUserData({}));
    dispatch(actions.setProjectType(""));
    dispatch(actions.setLogin(false));
    localStorage.removeItem('token');
    localStorage.removeItem('project-type');
    history.push("/login");
  };

  const handleEdit = () => {
    setVisible(true);
  }

  const profile = () => (
    <div>
      <p onClick={handleEdit} style={{ cursor: "pointer" }}>Tài khoản</p>
      <p onClick={handleChangePassword} style={{ cursor: "pointer" }}>Đổi mật khẩu</p>
      <p onClick={handleLogout} style={{ cursor: "pointer" }}>
        Đăng xuất
      </p>
    </div>
  );

  const handleChangePassword = () => {
    history.push({
      pathname: '/change-password',
      state: { lastRoute: location.pathname },
    });
  }

  return (
    <Row type="flex" justify="end" align="middle" className="right-header">
      <StyleNavItem>
        <Popover
          placement="bottom"
          title="Thông báo"
          content={notification}
          trigger="click"
        >
          <BellOutlined style={{ color: "gray", fontSize: 32 }} />
        </Popover>
      </StyleNavItem>

      <StyleNavItem>
        <Popover
          placement="bottom"
          title="Thông tin tài khoản"
          content={profile}
          trigger="click"
        >
          <StyleUserProfileContainer>
            <Badge dot color="#04B653">
              <Avatar shape="circle" size="large" src={userHost + user.avatar} />
            </Badge>
            <StyleUserName>
              <span className="text-info role">{user.role}</span>
              <span className="text-info username">{user.full_name}</span>
            </StyleUserName>
          </StyleUserProfileContainer>
        </Popover>
      </StyleNavItem>
      <ModalUser userId={user.id} setVisible={setVisible} visible={visible}/>
    </Row>
  );
};

export default Navbar;
