import React, { Component } from "react";
import {Table, Space, Input, Form, Select, Modal, notification, Row, Col, Image, Spin, InputNumber} from 'antd';
import { Button } from 'antd';
import StyleList from './index.style';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";

import axios from 'axios';

class List extends Component {

  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      currentTable: null,
      tables: [],
      idPayload: null,
      modalLoading: false,
      detailBill: [],
      detailPayload: {},
      options: [],
      payload: {},
      visibleAdd: false,
      visibleDelete: false,
      visibleMaintenance: false,
      idPayloadDelete: null,
      status: [
        { value: 'working', label: 'Đang sử dụng' },
        { value: 'idle', label: 'Sẵn có' },
        { value: 'fixing', label: 'Đang sửa' },
        { value: 'charging', label: 'Đang sạc' }
      ],
      idPayloadFix: null
    }
  }

   openNotificationSucess = (message) => {
    notification.success({
      message: message,
    })
  };

  openNotificationError = (message) => {
    notification.error({
      message: message,
    })
  };

  handleClick() {
    let history = useHistory();
    history.push("/edit-payload");
  }

  componentDidMount() {
    this.loadAllPayload();
    this.getAllTypePayload();
  }

  loadAllPayload() {
    this.setState({modalLoading: true});
    axios.get(`http://dsd06.herokuapp.com/api/payload`)
      .then(res => {
        if (res.status == 500) {
          this.openNotificationError(res.data.message || "")
        } else {
          this.setState({modalLoading: false});
          let arr = res.data.filter((item) => {return item.type != null});
          this.setState({ tables: arr });
        }
      })
  }


  showModal = (record) => {
    this.setState({ visible: true });
    this.setState({ detailPayload: {} })

    this.setState({ detailPayload: record });
    this.setState({ idPayload: record.id })
  };

  handleOk = e => {
    this.setState({ visible: false })
  };

  handleCancel = e => {
    this.setState({ visible: false })
  };


  handleCancelAdd = e => {
    this.setState({ visibleAdd: false })
  };

  handleCancelDelete = e => {
    this.setState({ visibleDelete: false })
  }

  getAllTypePayload() {
    axios.get(`https://dsd06.herokuapp.com/api/payloadtype`)
      .then(res => {
        const options = res.data.map(payload =>
          ({
            label: payload.name,
            value: payload._id,
          })
        )
        this.setState({ Options: options });
      })

  }
  handleFormSubmitEdit(values) {
    const data = {
      code: values.code,
      image: values.image,
      name: values.name,
      type: values.type,
      detail: {
        manufacturer: values.manufacturer,
        weight: values.weight,
        opticalZoom: values.opticalZoom,
        digitalZoom: values.digitalZoom,
        panning: {
          min: values.panningmin,
          max: values.panningmax,
        },
        tilting: {
          min: values.tiltingmin,
          max: values.tiltingmax
        },
        zoom: {
          min: values.zoomingmin,
          max: values.zoomingmax
        },
        size: {
          width: values.sizewidth,
          length: values.sizelength,
          height: values.sizeheight
        }
      }

    };
    axios.put(`https://dsd06.herokuapp.com/api/payload/` + this.state.idPayload, data)
      .then(res => {
        console.log(res.data);
        this.setState({ visible: false })
        this.loadAllPayload();
      })

  }

  renderModal() {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return <Form   {...layout} onFinish={(values) => this.handleFormSubmitEdit(values)} >

      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item initialValue={this.state.detailPayload.code}
            label="Mã"
            name="code"
            rules={[{ required: true, message: 'Hãy nhập mã!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item initialValue={this.state.detailPayload.image}
            label="Link ảnh"
            name="image"
            rules={[{ required: true, message: 'Hãy nhập mã!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
       
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label="Loại" initialValue={this.state.detailPayload.type_id}
            name="type"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Select options={this.state.Options} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item initialValue={this.state.detailPayload.name}
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Hãy nhập tên payload!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Weight" name="weight" initialValue={this.state.detailPayload.weight}>
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Nhà sản xuất" name="manufacturer" initialValue={this.state.detailPayload.manufacturer}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="OpticalZoom" name="opticalZoom" initialValue={this.state.detailPayload.opticalZoom} >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="DigitalZoom" name="digitalZoom" initialValue={this.state.detailPayload.digitalZoom}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Panning min" name="panningmin" initialValue={this.state.detailPayload.panningmin}>
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Panning max" name="panningmax" initialValue={this.state.detailPayload.panningmax}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Tilting min" name="tiltingmin" initialValue={this.state.detailPayload.tiltingmin} >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Tilting max" name="tiltingmax" initialValue={this.state.detailPayload.tiltingmax}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Zooming min" name="zoomingmin" initialValue={this.state.detailPayload.zoommin}>
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Zooming max" name="zoomingmax" initialValue={this.state.detailPayload.zoommax}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          <Form.Item label="Width" name="sizewidth" initialValue={this.state.detailPayload.sizewidth}>
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8} >
          <Form.Item label="Height" name="sizeheight" initialValue={this.state.detailPayload.sizeheight}>
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item label="Length" name="sizelength" initialValue={this.state.detailPayload.sizelength}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
   </Button>
      </Form.Item>
    </Form>



  }

  showModalAdd() {
    this.setState({ visibleAdd: true });
  }

  handleFormSubmit(values) {
    console.log(values)
    const data = {
      code: values.code,
      name: values.name,
      type: values.type,
      image: values.image,
      detail: {
        manufacturer: values.manufacturer,
        weight: values.weight,
        opticalZoom: values.opticalZoom,
        digitalZoom: values.digitalZoom,
        panning: {
          min: values.panningmin,
          max: values.panningmax,
        },
        tilting: {
          min: values.tiltingmin,
          max: values.tiltingmax
        },
        zoom: {
          min: values.zoomingmin,
          max: values.zoomingmax
        },
        size: {
          width: values.sizewidth,
          length: values.sizelength,
          height: values.sizeheight
        }
      }

    };
    axios.post(`https://dsd06.herokuapp.com/api/payload`, data)
      .then(res => {
        console.log(res.data);
        this.openNotificationSucess("Thêm thành công")
        this.setState({ visibleAdd: false })
        this.loadAllPayload();
      })

  }

  renderModalAdd() {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return <Form   {...layout} onFinish={(values) => this.handleFormSubmit(values)} >

      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label="Mã"
            name="code"
            rules={[{ required: true, message: 'Hãy nhập mã!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Hãy nhập tên payload!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: 'Hãy chọn loại Payload' }]}
          >
            <Select options={this.state.Options} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label="Link ảnh"
            name="image"
            rules={[{ required: true, message: 'Hãy nhập link ảnh!' }]}
          >
            <Input/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Weight" name="weight" initialValue={100} >
            <InputNumber
                defaultValue={100}
                min={1}
                max={10000}
                formatter={value => `${value} gam`}
                parser={value => value.replace(' gam', '')}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Nhà sản xuất" name="manufacturer" rules={[{ required: true, message: 'Hãy nhập NSX' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="OpticalZoom" name="opticalZoom" initialValue={1}>
            <InputNumber
                min={1}
                max={100}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="DigitalZoom" name="digitalZoom" initialValue={1}>
            <InputNumber
                defaultValue={1}
                min={1}
                max={10000}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Panning min" name="panningmin" initialValue={180}>
            <InputNumber
                defaultValue={180}
                min={1}
                max={360}
                formatter={value => `${value} độ`}
                parser={value => value.replace(' độ', '')}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Panning max" name="panningmax" initialValue={180}>
            <InputNumber
                defaultValue={180}
                min={1}
                max={360}
                formatter={value => `${value} độ`}
                parser={value => value.replace(' độ', '')}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Tilting min" name="tiltingmin" initialValue={180}>
            <InputNumber
                defaultValue={180}
                min={1}
                max={360}
                formatter={value => `${value} độ`}
                parser={value => value.replace(' độ', '')}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Tilting max" name="tiltingmax" initialValue={180}>
            <InputNumber
                defaultValue={180}
                min={1}
                max={360}
                formatter={value => `${value} độ`}
                parser={value => value.replace(' độ', '')}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Zooming min" name="zoomingmin" initialValue={1}>
            <InputNumber min={0} max={10000} defaultValue={1} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item label="Zooming max" name="zoomingmax" initialValue={1}>
            <InputNumber min={0} max={10000} defaultValue={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          <Form.Item label="Width" name="sizewidth" initialValue={10}>
            <InputNumber
                defaultValue={10}
                min={1}
                max={100}
                formatter={value => `${value} cm`}
                parser={value => value.replace(' cm', '')}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8} >
          <Form.Item label="Height" name="sizeheight" initialValue={10}>
            <InputNumber
                defaultValue={10}
                min={1}
                max={100}
                formatter={value => `${value} cm`}
                parser={value => value.replace(' cm', '')}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item label="Length" name="sizelength" initialValue={10}>
            <InputNumber
                defaultValue={10}
                min={1}
                max={100}
                formatter={value => `${value} cm`}
                parser={value => value.replace(' cm', '')}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
      </Button>
      </Form.Item>
    </Form>
  }

  showModalDelete(record) {
    this.setState({ visibleDelete: true })
    this.setState({ idPayloadDelete: record.id })
  }

  deleteRecord() {
    axios.delete(`https://dsd06.herokuapp.com/api/payload/` + this.state.idPayloadDelete)
      .then(res => {
        this.openNotificationSucess("Xóa thành công")
        this.setState({ visibleDelete: false })
        this.loadAllPayload();
      })
  }

  renderModalDelete() {
    return <div>
      <p>Bạn có chắc xóa bản ghi này?</p>
      <Button type="primary" danger onClick={() => this.deleteRecord()}>Xóa</Button>
    </div>

  }

  renderModalMaintenance() {
    const { TextArea } = Input
    return <div>
      <Form onFinish={(values) => this.handleSubmitMaintenance(values)} >
        <Form.Item label="Lý do" name="reason">
          <TextArea rows={4} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
      </Button>
      </Form>
    </div>
  }

  handleSubmitMaintenance(values) {
    //console.log(values.reason);
    axios.post(`https://dsd06.herokuapp.com/api/payloadregister/fix/` + this.state.idPayloadFix, values.reason)
      .then(res => {
        this.setState({ visibleMaintenance: false })
        this.openNotificationSucess("Chuyển trạng thái thành công")
        this.loadAllPayload();
      })

  }



  searchPayload(values) {
    this.setState({modalLoading: true});
    axios.get(`http://dsd06.herokuapp.com/api/payload`, { params: { type: values.type, status: values.status } })
      .then(res => {
        this.setState({modalLoading: false});
        this.setState({ tables: res.data });
      })
  }

  showMaintenance(id) {
    this.setState({idPayloadFix: id});
    this.setState({ visibleMaintenance: true });
  }

  handleCancelMaintenance = e => {
    this.setState({ visibleMaintenance: false })
  }

  showCharging(id) {
    axios.post(`https://dsd06.herokuapp.com/api/payloadregister/charge/` + id)
      .then(res => {
        this.openNotificationSucess("Chuyển trạng thái sạc thành công")
        this.loadAllPayload();
      })
  }

  chargeDone(id) {
    axios.post(`https://dsd06.herokuapp.com/api/payloadregister/chargeDone/${id}`)
      .then(res => {
        if (res.status == 200) {
          this.openNotificationSucess("Chuyển trạng thái sạc thành công")
          this.loadAllPayload();
        } else {
          this.openNotificationError(res.data.message || "Hệ thống đang gặp lỗi!")
        }
      })
  }

  fixDone(id) {
    axios.post(`https://dsd06.herokuapp.com/api/payloadregister/return/${id}`)
      .then(res => {
        if (res.status == 200) {
          this.openNotificationSucess("Chuyển trạng thái sửa chữa thành công")
          this.loadAllPayload();
        } else {
          this.openNotificationError(res.data.message || "Hệ thống đang gặp lỗi!")
        }
      })
  }


  render() {

    const dataSource = this.state.tables.map(payload =>
      ({
        id: payload._id,
        code: payload.code,
        name: payload.name,
        status: payload.status,
        manufacturer: payload.detail.manufacturer,
        type: payload.type.name,
        des: payload.type.description,
        type_id: payload.type._id,
        weight: payload.detail.weight,
        opticalZoom: payload.detail.opticalZoom,
        digitalZoom: payload.detail.digitalZoom,
        sizewidth: payload.detail.size.width,
        sizeheight: payload.detail.size.height,
        sizelength: payload.detail.size.length,
        panningmin: payload.detail.panning.min,
        panningmax: payload.detail.panning.max,
        tiltingmin: payload.detail.tilting.min,
        tiltingmax: payload.detail.tilting.max,
        zoommin: payload.detail.zoom.min,
        zoommax: payload.detail.zoom.max,
        image: payload.image

      })
    )



    const columns = [
      {
        title: 'Mã ',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Hình ảnh',
        key: 'image',
        render: (record) => (

          <Image 
            width={100} height={80}
            src= {record.image}
          />

          
        ),
      },
      {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Nhà sản xuất',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      {
        title: 'Loại',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Action',
        key: 'operation',
        width: 100,
        render: (text, record) => (

          <Space size="small" >
            <Button type="link" onClick={() => this.showModal(record)} >Sửa</Button>
            <Button danger type="text" onClick={() => this.showModalDelete(record)}>Xóa</Button>
            {record.status == "idle" ? <Button type="link" onClick={() => this.showMaintenance(record.id)}>Bảo dưỡng</Button> : <div/>}
            {record.status == "idle" ? <Button type="link" onClick={() => this.showCharging(record.id)}>Sạc</Button> : <div/>}
            {record.status == "charging" ? <Button type="link" onClick={() => this.chargeDone(record.id)}>Sạc xong</Button> : <div/>}
            {record.status == "fixing" ? <Button type="link" onClick={() => this.fixDone(record.id)}>Sửa xong</Button> : <div/>}
          </Space>
        ),
      },
    ];

    const { visible, visibleAdd, visibleDelete, visibleMaintenance, tables, modalLoading } = this.state;

    return (
      <StyleList>
        <div>
          <h2>Quản lý Payload</h2>
          <br />
          <Form
            layout="horizontal"
            className="searchtype" onFinish={(values) => this.searchPayload(values)}
          >
            <Row justify="space-around">
              <Col span={5}>
                <Form.Item label="Loại" name="type">
                  <Select options={this.state.Options} />

                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="Trạng thái" name="status">
                  <Select options={this.state.status} />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  Tìm kiếm
              </Button>
              </Col>
            </Row>
          </Form>
          <Button type="primary" className="buttontype" onClick={() => this.showModalAdd()} >Thêm</Button>
          <Spin spinning={modalLoading} tip="Loading...">
          <Table dataSource={dataSource} columns={columns} />
          </Spin>
        </div>
        <Modal
          title="Chi tiết"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null} width={800}
        >
          {
            this.renderModal()
          }
        </Modal>

        <Modal
          title="Thêm Payload" width={800}
          visible={visibleAdd}
          onOk={this.handleOkAdd}
          onCancel={this.handleCancelAdd}
          footer={null}
        >
          {
            this.renderModalAdd()
          }
        </Modal>

        <Modal
          title="Xóa Payload"
          visible={visibleDelete}
          onOk={this.handleOkDelete}
          onCancel={this.handleCancelDelete}
          footer={null}
        >
          {
            this.renderModalDelete()
          }
        </Modal>
        <Modal
          title="Đăng ký bảo dưỡng"
          visible={visibleMaintenance}
          onOk={this.handleOkDelete}
          onCancel={this.handleCancelMaintenance}
          footer={null}
        >
          {
            this.renderModalMaintenance()
          }
        </Modal>
      </StyleList>
    )
  }
}
export default List; 