"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireWildcard(require("react-dom"));
var _antd = require("antd");
var _componentCache = require("@ivoyant/component-cache");
var _componentMessageBus = require("@ivoyant/component-message-bus");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
let resolve;
const defaultProps = {
  title: 'Confirmation',
  message: 'Are you sure?'
};

// Do not show Cancel Button for certain Profiles

const {
  Text
} = _antd.Typography;
const Title = _ref => {
  let {
    title
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(Text, {
    strong: true,
    type: "danger"
  }, title);
};
const Message = _ref2 => {
  let {
    message
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement(Text, {
    style: {
      color: '#820013'
    }
  }, message);
};
class Prompt extends _react.Component {
  static createAndShow() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      showOnExpr
    } = props;
    let willPrompt;
    if (showOnExpr) {
      willPrompt = _componentCache.cache.eval(showOnExpr);
    } else {
      willPrompt = true;
    }
    let returnVal;
    if (willPrompt) {
      const prompt = Prompt.create(props);
      returnVal = prompt?.show();
    } else {
      returnVal = Promise.resolve(true);
    }
    return returnVal;
  }
  static create() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const container = document.createElement('div');
    document.body.appendChild(container);
    return (0, _reactDom.render)( /*#__PURE__*/_react.default.createElement(Prompt, {
      createConfirmProps: {
        ...props,
        container
      }
    }), container);
  }
  constructor() {
    super();
    this.state = {
      isOpen: false,
      showConfirmProps: {}
    };
    this.handleCancel = this.onCancel.bind(this);
    this.handleConfirm = this.onConfirm.bind(this);
    this.show = this.show.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }
  cleanup() {
    _reactDom.default.unmountComponentAtNode(this.props.createConfirmProps.container);
    document.body.removeChild(this.props.createConfirmProps.container);
    _antd.Modal.destroyAll(); // I don't think this is needed
  }

  onCancel() {
    this.setState({
      isOpen: false
    });
    this.cleanup();
    resolve(false);
  }
  onConfirm(ok) {
    this.setState({
      isOpen: false
    });
    this.cleanup();
    if (ok?.events) {
      ok.events.forEach(event => {
        _componentMessageBus.MessageBus.send(event, {});
      });
    }
    resolve(true);
  }
  show() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const showConfirmProps = {
      ...this.props.createConfirmProps,
      ...props
    };
    this.setState({
      isOpen: true,
      showConfirmProps
    });
    const {
      message,
      title,
      cancel,
      ok,
      ...rest
    } = showConfirmProps;
    let okButtonProps = {
      type: 'default'
    };
    if (ok && ok?.disabled === false) {
      okButtonProps.className = 'dismiss-button';
      okButtonProps.danger = true;
    } else {
      okButtonProps.disabled = true;
      if (!ok) {
        okButtonProps.style = {
          display: 'none'
        };
      }
    }
    const modalData = {
      className: 'app-notification',
      title: /*#__PURE__*/_react.default.createElement(Title, {
        title: title
      }),
      content: /*#__PURE__*/_react.default.createElement(Message, {
        message: message
      }),
      cancelText: cancel?.text,
      cancelButtonProps: {
        type: 'default',
        className: 'dismiss-button'
      },
      okText: ok?.text,
      okButtonProps,
      closable: false,
      onOk: () => this.onConfirm(ok),
      onCancel: () => this.onCancel(),
      style: {
        position: 'absolute',
        top: 20,
        right: 20
      }
    };
    _antd.Modal.confirm(modalData);
    return new Promise(res => {
      resolve = res;
    });
  }
  render() {
    const {
      isOpen,
      showConfirmProps
    } = this.state;
    const {
      message,
      title,
      cancelButton,
      okButton,
      ...rest
    } = showConfirmProps;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  }
}
var _default = Prompt;
exports.default = _default;
module.exports = exports.default;