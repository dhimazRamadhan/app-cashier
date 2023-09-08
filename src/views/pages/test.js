return (
    <Container>
      <Text
        cursor={"pointer"}
        onClick={() => navigate("/dashboard/kasir/transaksi")}
        mb={4}
      >{`<-- Kembali Ke Transaksi`}</Text>
      <Heading text="Tambah Transaksi" /> {/* memanggil komponen heading */}
      <Button
        colorScheme={"green"}
        size={"sm"}
        w={{ md: "40%", lg: "30%", xl: "20%" }}
        mt={2}
        // panggil fungsi handleSubmit dan submitHandlerTransaksi saat tombol tambah diklik
        onClick={handleSubmit(async (values) => {
          await submitHandlerTransaksi(values);
        })}
        isLoading={loading}
      >
        Simpan Transaksi
      </Button>
      {/* menampilkan alert notifikasi */}
      <AlertNotification status={status} message={message} />
      <Grid
        templateColumns={{ md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={10}
        my={6}
      >
        <GridItem>
          <Flex direction="column">
            <Text fontSize={"sm"} fontFamily={"Poppins"}>
              Nomor Meja
            </Text>
            <Select
              name="id_meja"
              id="id_meja"
              borderRadius="lg"
              focusBorderColor="green.600"
              placeholder="Nomor Meja"
              {...register("id_meja", {
                required: true,
              })}
            >
              {dataMeja.map((item, index) => (
                <option key={index} value={item.id_meja}>
                  {item.nomor_meja}
                </option>
              ))}
            </Select>
            {/* 
                    jika error type nya required, maka tampilkan pesan error
                  */}
            {errors.id_meja?.type === "required" && (
              <FormHelperText textColor="red" mb={4}>
                Masukkan Nomor Meja
              </FormHelperText>
            )}
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction="column">
            <Text fontSize={"sm"} fontFamily={"Poppins"}>
              Nama Pelanggan
            </Text>
            <Input
              name="nama_pelanggan"
              id="nama_pelanggan"
              borderRadius="lg"
              focusBorderColor="green.600"
              placeholder="Nama Pelanggan"
              {...register("nama_pelanggan", {
                required: true,
              })}
            />
            {/* jika error type nya required, maka tampilkan pesan error */}
            {errors.nama_pelanggan?.type === "required" && (
              <FormHelperText textColor="red" mb={4}>
                Masukkan Nama Pelanggan
              </FormHelperText>
            )}
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction="column">
            <Text fontSize={"sm"} fontFamily={"Poppins"}>
              Status Pembayaran
            </Text>
            <Select
              name="status"
              id="status"
              borderRadius="lg"
              focusBorderColor="green.600"
              placeholder="Status Pembayaran"
              {...register("status", {
                required: true,
              })}
            >
              <option value="belum_bayar">Belum Bayar</option>
              <option value="lunas">Lunas</option>
            </Select>
            {/* jika error type nya required, maka tampilkan pesan error */}
            {errors.status?.type === "required" && (
              <FormHelperText textColor="red" mb={4}>
                Masukkan Status
              </FormHelperText>
            )}
          </Flex>
        </GridItem>
      </Grid>
      <Heading text="Detail Pemesanan" /> {/* memanggil komponen heading */}
      <Flex flexDir={"column"}>
        <Button
          colorScheme={"green"}
          size={"sm"}
          mt={4}
          w={{ md: "40%", lg: "30%", xl: "20%" }}
          onClick={() => {
            handleAddRow();
          }}
        >
          Tambah Menu
        </Button>
        {kolomMenu.map((row, indexRow) => (
          <Flex
            w={"full"}
            gap={10}
            my={6}
            alignItems={"flex-end"}
            key={indexRow}
          >
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Nama Menu
              </Text>
              <Select
                onChange={(e) => {
                  handleChange(e, indexRow, "menu");
                }}
                value={row.nama_menu}
                placeholder="Pilih Menu"
              >
                {menu.map((item) => (
                  <option value={item.nama_menu}>{item.nama_menu}</option>
                ))}
              </Select>
            </Flex>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Harga
              </Text>
              <Input readOnly value={row.harga} />
            </Flex>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Jumlah
              </Text>
              <Flex alignItems={"center"} gap={3}>
                <Button
                  colorScheme={"blue"}
                  size={"md"}
                  onClick={() => {
                    handleChange(row.jumlah - 1, indexRow, "jumlah");
                  }}
                >
                  -
                </Button>
                <Text fontSize={"xl"} fontWeight={"semibold"}>
                  {row.jumlah}
                </Text>
                <Button
                  colorScheme={"blue"}
                  size={"md"}
                  onClick={() => {
                    handleChange(row.jumlah + 1, indexRow, "jumlah");
                  }}
                >
                  +
                </Button>
              </Flex>
            </Flex>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Total Harga
              </Text>
              <Input readOnly value={row.total_harga} />
            </Flex>
            <Button
              colorScheme={"red"}
              size={"md"}
              onClick={() => {
                handleDeleteRow(indexRow);
              }}
            >
              Hapus
            </Button>
          </Flex>
        ))}
        {/* jika kolom menu lebih dari 0, maka tampilkan total harga */}
        {kolomMenu.length > 0 && (
          <Text fontSize={"md"} mb={2} fontFamily={"Poppins"}>
            Total Harga : Rp.
            {/* 
            menampilkan total harga dengan menggunakan fungsi reduce
            reduce adalah fungsi yang digunakan untuk mengurangi array menjadi satu nilai
            reduce akan menghitung total harga dari semua menu yang ada
          */}
            {kolomMenu.reduce((total, item) => {
              // total adalah nilai awal, item adalah nilai yang akan dihitung
              return total + item.total_harga;
            }, 0)}
          </Text>
        )}
      </Flex>
    </Container>
  );
}