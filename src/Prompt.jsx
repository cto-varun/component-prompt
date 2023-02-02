import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Typography, Modal } from 'antd';
import { cache } from '@ivoyant/component-cache';
import { MessageBus } from '@ivoyant/component-message-bus';

import { render } from 'react-dom';

let resolve;

const defaultProps = {
    title: 'Confirmation',
    message: 'Are you sure?',
};

// Do not show Cancel Button for certain Profiles

const { Text } = Typography;

const Title = ({ title }) => {
    return (
        <Text strong type="danger">
            {title}
        </Text>
    );
};

const Message = ({ message }) => {
    return <Text style={{ color: '#820013' }}>{message}</Text>;
};

class Prompt extends Component {
    static createAndShow(props = {}) {
        const { showOnExpr } = props;

        let willPrompt;
        if (showOnExpr) {
            willPrompt = cache.eval(showOnExpr);
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

    static create(props = {}) {
        const container = document.createElement('div');
        document.body.appendChild(container);
        return render(
            <Prompt createConfirmProps={{ ...props, container }} />,
            container
        );
    }

    constructor() {
        super();

        this.state = {
            isOpen: false,
            showConfirmProps: {},
        };

        this.handleCancel = this.onCancel.bind(this);
        this.handleConfirm = this.onConfirm.bind(this);
        this.show = this.show.bind(this);
        this.cleanup = this.cleanup.bind(this);
    }

    cleanup() {
        ReactDOM.unmountComponentAtNode(
            this.props.createConfirmProps.container
        );
        document.body.removeChild(this.props.createConfirmProps.container);
        Modal.destroyAll(); // I don't think this is needed
    }

    onCancel() {
        this.setState({ isOpen: false });
        this.cleanup();
        resolve(false);
    }

    onConfirm(ok) {
        this.setState({ isOpen: false });
        this.cleanup();
        if(ok?.events) {
            ok.events.forEach((event) => {
                MessageBus.send(event,{});
            });
        }
        resolve(true);
    }

    show(props = {}) {
        const showConfirmProps = { ...this.props.createConfirmProps, ...props };
        this.setState({ isOpen: true, showConfirmProps });
        const { message, title, cancel, ok, ...rest } = showConfirmProps;

        let okButtonProps = {
            type: 'default',
        };
        if (ok && ok?.disabled === false) {
            okButtonProps.className = 'dismiss-button';
            okButtonProps.danger = true;
        } else {
            okButtonProps.disabled = true;
            if(!ok) {
                okButtonProps.style = {display:'none'}
            }
        }

        const modalData = {
            className: 'app-notification',
            title: <Title title={title} />,
            content: <Message message={message} />,
            cancelText: cancel?.text,
            cancelButtonProps: { type: 'default', className: 'dismiss-button' },
            okText: ok?.text,
            okButtonProps,
            closable: false,
            onOk: () => this.onConfirm(ok),
            onCancel: () => this.onCancel(),
            style: {
                position: 'absolute',
                top: 20,
                right: 20,
            },
        };

        Modal.confirm(modalData);

        return new Promise((res) => {
            resolve = res;
        });
    }

    render() {
        const { isOpen, showConfirmProps } = this.state;
        const {
            message,
            title,
            cancelButton,
            okButton,
            ...rest
        } = showConfirmProps;
        return <></>;
    }
}

export default Prompt;
