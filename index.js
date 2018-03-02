const color = require('color');

exports.decorateTerm = (Term, { React, notify }) => {
    
    return class extends React.PureComponent {
        constructor(props)  {
            super(props);

            this.state = {
                coins: [{
                   symbol: 'loading...',
                   price: '',
                   priceChange1h: '',
                   priceChange24: ''
                }],
            };
        }

        render() {
            const { customChildren } = this.props;
            const existingChildren = customChildren 
                ? customChildren instanceof Array 
                    ? customChildren 
                    : [customChildren]
                : [];

            return (
                React.createElement(Hyper, Object.assign({}, this.props, {
                    customInnerChildren: existingChildren.concat(
                        getPriceComponents()
                    )
                }))
            );
        }

        componentDidMount() {
            this.interval = setInterval(this.getPriceData, 15 * 1000);
            this.getPriceData();
        }

        getPriceComponents() {
            let components = [];
            this.state.coins.forEach((coin) => {
                let component = React.createElement('div', { className: 'component_crypto_group' },
                    React.createElement('div', { className: 'component_item' }, coin.symbol),
                    React.createElement('div', { className: 'component_item' }, coin.price),
                    React.createElement('div', { className: 'component_item' }, coin.priceChange1h),
                    React.createElement('div', { className: 'component_item' }, coin.priceChange24),
                );
                components.push(component);
            });

            return components;
        }

        getPriceData() {
            const url = 'https://api.coinmarketcap.com/v1/ticker/btc';
            return fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    let coins = [];
                    data.forEach((coin) => {
                        coins.push({
                            symbol: coin.symbol,
                            price: coin.price_usd,
                            priceChange1h: coin.percent_change_1h,
                            priceChange24: coin.percent_change_24h,
                        });
                    });

                    this.setState({
                        coins: coins
                    });
                }).catch((error) => {
                    console.error(error);
                });

        }
    };
};

