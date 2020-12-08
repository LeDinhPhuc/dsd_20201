import React, { useCallback } from "react";
import {
  StyleNavItem,
  StyleUserName,
  StyleUserProfileContainer,
} from "./index.style";
import { Row, Popover, Avatar, Badge } from "antd";

import { BellOutlined, UserOutlined } from "@ant-design/icons";

import { useUserState } from '../../hooks/useUserState';

const Navbar = () => {
  const { userState, login } = useUserState();

  const onLoginAdmin = useCallback(() => {
    login({
      uid: 3,
      token: '4c901bcdba9f440a2a7c31c0bcbd78ec',
      projectType: 'LUOI_DIEN',
      role: 'ADMIN',
    });
  }, [login]);

  const onLoginManager = useCallback(() => {
    login({
      uid: 11,
      token: '4e3fe3463afd3a705c0be7ec2322c335',
      projectType: 'LUOI_DIEN',
      role: 'MANAGER',
    });
  }, [login]);

  const onLoginSupervisor = useCallback(() => {
    login({
      uid: 3,
      token: '4c901bcdba9f440a2a7c31c0bcbd78ec',
      projectType: 'LUOI_DIEN',
      role: 'SUPERVISOR',
    });
  }, [login]);

  const onLoginDroneStaff = useCallback(() => {
    login({
      uid: 58,
      token: '072bf8dbb7c5e4b1248da61d5b3f65f3',
      projectType: 'LUOI_DIEN',
      role: 'DRONE_STAFF',
    });
  }, [login]);

  const onLoginIncidentStaff = useCallback(() => {
    login({
      uid: 178,
      token: '6a36286b6f322c23e110b6a955742ced',
      projectType: 'LUOI_DIEN',
      role: 'INCIDENT_STAFF',
    });
  }, [login]);

  const notification = () => (
    <div>
      <p>Thông báo</p>
    </div>
  );

  const profile = () => (
    <div>
      <p>
        <a onClick={onLoginAdmin}>Login Admin</a>
      </p>
      <p>
        <a onClick={onLoginManager}>Login Manager</a>
      </p>
      <p>
        <a onClick={onLoginSupervisor}>Login Supervisor</a>
      </p>
      <p>
        <a onClick={onLoginDroneStaff}>Login Drone Staff</a>
      </p>
      <p>
        <a onClick={onLoginIncidentStaff}>Login Incident Staff</a>
      </p>
      <p>Tài khoản</p>
      <p>Đăng xuất</p>
    </div>
  );

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
          title="Profile"
          content={profile}
          trigger="click"
        >
          <StyleUserProfileContainer>
            <Badge dot color="#04B653">
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                shape="circle"
                icon={<UserOutlined />}
                size="large"
              />
            </Badge>
            <StyleUserName>
              <span className="text-info role">{userState?.info?.role}</span>
              <span className="text-info username">Vũ Đức Đam</span>
            </StyleUserName>
          </StyleUserProfileContainer>
        </Popover>
      </StyleNavItem>
    </Row>
  );
};

export default Navbar;
