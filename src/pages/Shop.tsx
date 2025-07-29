<<<<<<<
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2070&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-orange-100" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Discover & Shop</h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Find exactly what you need from trusted vendors across Kenya.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters and Search Bar */}
          <Card className="mb-8 p-6 shadow-lg border border-gray-100">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Search Input */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    aria-label="Search products"
                  />
                </div>

                {/* Category Filter (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-select" className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {PRODUCT_CATEGORIES.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-select" className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Buttons */}
                <div className="flex gap-2 justify-end sm:justify-start">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} className="shadow-sm" onClick={() => setViewMode('grid')} aria-label="Grid View">
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} className="shadow-sm" onClick={() => setViewMode('list')} aria-label="List View">
                    <List className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Filter Sheet */}
                <div className="sm:hidden col-span-full">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center gap-2 shadow-sm">
                        <Filter className="h-5 w-5" /> More Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Filter /> Filters
                        </SheetTitle>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        {/* Mobile Category Filter */}
                        <div>
                          <label htmlFor="mobile-category-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Tag className="h-4 w-4" /> Category
                          </label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger id="mobile-category-select" className="w-full">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {PRODUCT_CATEGORIES.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Sort By */}
                        <div>
                          <label htmlFor="mobile-sort-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <List className="h-4 w-4" /> Sort By
                          </label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger id="mobile-sort-select" className="w-full">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              {SORT_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Price Range Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> Price Range
                          </label>
                          <Slider
                            min={0}
                            max={5000}
                            step={10}
                            value={priceRange}
                            onValueChange={(val: [number, number]) => setPriceRange(val)}
                            className="w-full"
                          />
                          <div className="flex justify-between items-center mt-3 text-sm font-semibold text-gray-700">
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={minPriceInput}
                                onChange={handleMinPriceInputChange}
                                className="w-24 text-center"
                                min={0}
                              />
                            </div>
                            <span>-</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={maxPriceInput}
                                onChange={handleMaxPriceInputChange}
                                className="w-24 text-center"
                                min={0}
                              />
                            </div>
                          </div>
                        </div>

                        <Button onClick={handleClearFilters} variant="outline" className="w-full mt-4">
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              {/* Desktop Price Range Filter */}
              <div className="mt-6 hidden sm:block">
                <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  min={0}
                  max={5000} // Adjust max based on your product prices
                  step={10}
                  value={priceRange}
                  onValueChange={(val: [number, number]) => setPriceRange(val)}
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-3 text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={minPriceInput}
                      onChange={handleMinPriceInputChange}
                      className="w-32 text-center"
                      min={0}
                    />
                  </div>
                  <span>to</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={maxPriceInput}
                      onChange={handleMaxPriceInputChange}
                      className="w-32 text-center"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Listing */}
          {(isLoading || isFetching) ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading amazing products...</p>
            </div>
          ) : products && products.length > 0 ? ( 
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
              {products.map(product => ( 
                viewMode === 'grid'
                  ? <EnhancedProductCard key={product.id} product={product} />
                  : <EnhancedProductListItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
              <p className="text-md text-gray-600 mb-8">
                {searchTerm || selectedCategory !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 5000
                  ? 'No products match your current search and filter criteria. Try adjusting them!'
                  : 'It looks a bit empty here! Products will be added soon. Check back later!'}
              </p>
              <Button onClick={handleClearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-700 shadow-md flex items-center gap-2">
                <Filter className="h-5 w-5" /> Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
=======
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2070&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="relative z-10 flex items-center justify-center h-full px-6 sm:px-8 lg:px-12">
            <div className="text-center text-white max-w-3xl mx-auto">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-orange-100" />
              <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">Discover & Shop</h1>
              <p className="text-lg text-orange-100 font-light leading-relaxed">
                Find exactly what you need from trusted vendors across Kenya.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters and Search Bar */}
          <Card className="mb-8 p-6 shadow-lg border border-gray-100">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Search Input */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    aria-label="Search products"
                  />
                </div>

                {/* Category Filter (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category-select" className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {PRODUCT_CATEGORIES.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By (Desktop) */}
                <div className="hidden sm:block">
                  <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-select" className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Buttons */}
                <div className="flex gap-2 justify-end sm:justify-start">
                  <Button variant={viewMode === 'grid' ? 'default' : 'outline'} className="shadow-sm" onClick={() => setViewMode('grid')} aria-label="Grid View">
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'outline'} className="shadow-sm" onClick={() => setViewMode('list')} aria-label="List View">
                    <List className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Filter Sheet */}
                <div className="sm:hidden col-span-full">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center gap-2 shadow-sm">
                        <Filter className="h-5 w-5" /> More Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Filter /> Filters
                        </SheetTitle>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        {/* Mobile Category Filter */}
                        <div>
                          <label htmlFor="mobile-category-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Tag className="h-4 w-4" /> Category
                          </label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger id="mobile-category-select" className="w-full">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {PRODUCT_CATEGORIES.map(category => (<SelectItem key={category} value={category}>{category}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Sort By */}
                        <div>
                          <label htmlFor="mobile-sort-select" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <List className="h-4 w-4" /> Sort By
                          </label>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger id="mobile-sort-select" className="w-full">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              {SORT_OPTIONS.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mobile Price Range Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> Price Range
                          </label>
                          <Slider
                            min={0}
                            max={5000}
                            step={10}
                            value={priceRange}
                            onValueChange={(val: [number, number]) => setPriceRange(val)}
                            className="w-full"
                          />
                          <div className="flex justify-between items-center mt-3 text-sm font-semibold text-gray-700">
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={minPriceInput}
                                onChange={handleMinPriceInputChange}
                                className="w-24 text-center"
                                min={0}
                              />
                            </div>
                            <span>-</span>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={maxPriceInput}
                                onChange={handleMaxPriceInputChange}
                                className="w-24 text-center"
                                min={0}
                              />
                            </div>
                          </div>
                        </div>

                        <Button onClick={handleClearFilters} variant="outline" className="w-full mt-4">
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              {/* Desktop Price Range Filter */}
              <div className="mt-6 hidden sm:block">
                <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  min={0}
                  max={5000} // Adjust max based on your product prices
                  step={10}
                  value={priceRange}
                  onValueChange={(val: [number, number]) => setPriceRange(val)}
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-3 text-sm font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={minPriceInput}
                      onChange={handleMinPriceInputChange}
                      className="w-32 text-center"
                      min={0}
                    />
                  </div>
                  <span>to</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={maxPriceInput}
                      onChange={handleMaxPriceInputChange}
                      className="w-32 text-center"
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Listing */}
          {(isLoading || isFetching) ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600">Loading amazing products...</p>
            </div>
          ) : products && products.length > 0 ? ( 
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
              {products.map(product => ( 
                viewMode === 'grid'
                  ? <EnhancedProductCard key={product.id} product={product} />
                  : <EnhancedProductListItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Found</h3>
              <p className="text-md text-gray-600 mb-8">
                {searchTerm || selectedCategory !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 5000
                  ? 'No products match your current search and filter criteria. Try adjusting them!'
                  : 'It looks a bit empty here! Products will be added soon. Check back later!'}
              </p>
              <Button onClick={handleClearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-700 shadow-md flex items-center gap-2">
                <Filter className="h-5 w-5" /> Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
