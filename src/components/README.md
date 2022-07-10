<Table
                columns={columns}
                dataSource={tokens}
                style={{ color: "lime", backgroundColor: "#202020" }}
            ></Table>

            const columns = [
            {
                key: '1',
                dataIndex: 'logo',
                render: Logo => <img src={Logo} style={{
                    height: "25px",
                    width: "25px",
                }} />,
            },
            {
                key: '2',
                title: 'Name',
                dataIndex: 'Name',
            },
            {
                key: '3',
                title: 'Utility',
                dataIndex: 'Type',
            },
            {
                key: '4',
                title: 'Last',
                dataIndex: 'LastPrice',
            },
        ]
