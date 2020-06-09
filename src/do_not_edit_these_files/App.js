import React, { useState, useCallback, useRef, useMemo } from 'react';
import '../work_in_this_folder/style.css';
import LayoutDrawer, { Drawer } from '../work_in_this_folder/layout_drawer/layout_drawer.jsx'
import Table, {
  RowHeaderCell, // the indexed row cell
  HeaderCell, // the indexed column cell
  TableHeaderCell, // the corner cell between Row Headers and Column Headers
  TableCell,
  Row,
  Body,
  Header,
} from '../work_in_this_folder/table/table.jsx'
import maxBy from 'lodash/maxBy'
import orderBy from 'lodash/orderBy'
const alphabet = ("abcdefghijklmnopqrstuvwxyz").toUpperCase().split("");

function increasingSum(num, numIncreases, sum = 0) {
  return num > 0 ? increasingSum(num - 1, numIncreases, sum + num * numIncreases) : sum;
}

// cannot discard without using
// cannot redirect to a filled space

const hexominos = [
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  [[1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[1, 1], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[1, 2], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[1, 1], [1, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[1, 1], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 2], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 0], [1, 3], [0, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 1], [1, 2], [0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [0, 2], [0, 3], [0, 1]],
  [[0, 0], [1, 1], [2, 1], [0, 2], [0, 3], [0, 1]],
  [[2, 0], [0, 0], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 0], [0, 1], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 0], [0, 2], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 0], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 1], [0, 2], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 1], [0, 1], [1, 0], [1, 1], [1, 2], [1, 3]],
  [[2, 1], [1, 1], [1, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 3], [1, 1], [1, 0], [0, 1], [0, 2], [0, 3]],
  [[1, 0], [1, 1], [1, 2], [0, 2], [0, 3], [0, 4]],
  [[1, 0], [1, 1], [1, 2], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [1, 0]],
  [[2, 0], [0, 1], [2, 1], [1, 1], [1, 2], [1, 3]],
  [[2, 0], [0, 0], [2, 1], [1, 0], [1, 1], [1, 2]],
  [[2, 0], [0, 2], [2, 1], [1, 3], [1, 1], [1, 2]],
  [[2, 0], [0, 1], [2, 1], [0, 3], [1, 1], [0, 2]],
  [[2, 0], [0, 1], [1, 0], [0, 3], [1, 1], [0, 2]],
  [[0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 2], [0, 1], [0, 0], [1, 1], [2, 0], [2, 1]],
  [[1, 2], [0, 1], [0, 0], [1, 1], [2, 0], [2, 1]],
  [[2, 0], [0, 2], [1, 0], [0, 3], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 2]],
  [[1, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 1]],
  [[2, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 1]],
  [[2, 0], [0, 2], [2, 1], [0, 3], [1, 1], [1, 2]],
]
const pentominos = [
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[0, 1], [1, 1], [1, 2], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3]],
  [[0, 0], [1, 0], [2, 0], [1, 2], [1, 1]],
  [[0, 0], [0, 1], [2, 0], [1, 1], [2, 1]],
  [[2, 0], [2, 1], [2, 2], [1, 2], [0, 2]],
  [[2, 0], [2, 1], [1, 1], [1, 2], [0, 2]],
  [[1, 0], [1, 1], [1, 2], [0, 1], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [1, 2]],
  [[0, 2], [1, 0], [2, 0], [1, 2], [1, 1]],
]
const quadominos = [
  [[0, 1], [1, 0], [2, 0], [1, 1]],
  [[0, 1], [1, 0], [2, 0], [0, 0]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
]

const triominos = [
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [1, 0], [0, 1]],
  [[0, 0], [0, 1], [0, 2]],
]
const duelominos = [
  [[0, 1], [0, 0]],
]
const block = [
  [[0, 0]],
]

const polyominos = [
  hexominos,
  pentominos, pentominos,
  quadominos, quadominos, quadominos,
  triominos, triominos, triominos, triominos,
  duelominos, duelominos, duelominos, duelominos, duelominos,
  block, block, block, block, block, block,
].flat()

const secretPoly3 = orderBy([...triominos, ...triominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})], () => Math.random())[0]

const secretPoly4 = orderBy([...quadominos, ...quadominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})], () => Math.random())[0]

const secretPoly5 = orderBy([...pentominos, ...pentominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})], () => Math.random())[0]

const allPoly = [...polyominos, ...polyominos.map((array) => {
  const length = maxBy(array, "1")[1]

  return array.map(([r, c]) => [r, length - c])
})]

export default function App() {

  const width = 11

  var array = [...Array(width).keys()]
  var walkArray = [...Array(13).keys()]

  const coloredRef = useRef({})
  const [colored, setColored] = useState({})

  const polyCards = useMemo(() => orderBy(allPoly.map((shape) => generatePolyominos(shape)), () => Math.random()), [])

  const redirectCards = useMemo(() => {
    return orderBy([
      generateTerraformCards(0),
      generateTerraformCards(0),
    ].flat(), () => Math.random())
  }, [])

  const [rc1, setRc1] = useState();
  const [rc2, setRc2] = useState();
  const [rc3, setRc3] = useState();
  const [rcIndex, setRcIndex] = useState(0)

  const [pc1, setPc1] = useState()
  const [pc2, setPc2] = useState()
  const [pcIndex, setPcIndex] = useState(0)

  const onClickPc = useCallback((setPc) => {
    setPc(pcIndex)
    setPcIndex(pcIndex + 1)
  }, [pcIndex])

  const onClickRc = useCallback((setRc) => {
    setRc(rcIndex)
    setRcIndex(rcIndex + 1)
  }, [rcIndex])

  const onClickCell = useCallback((r, c, name) => {
    if (!coloredRef.current[name]) coloredRef.current[name] = {}
    if (!coloredRef.current[name][r]) coloredRef.current[name][r] = {}

    if (!coloredRef.current[name][r][c]) coloredRef.current[name][r][c] = "blue"
    else if (coloredRef.current[name][r][c] === "blue") coloredRef.current[name][r][c] = "#222"
    else coloredRef.current[name][r][c] = undefined
    setColored({ ...coloredRef.current })
  }, [])

  function getCellColor(r, c, name, defaultColor) {
    if (!colored[name]) return defaultColor
    if (!colored[name][r]) return defaultColor
    return colored[name][r][c];
  }

  const gridJsx = (
    <Table rowHeight={40} hideRowHeaders hideColumnHeaders style={{ width: 40 * 10 }}>
      {array.map((i) => (i === 0 || i === 10) ? null : (
        <HeaderCell className="flex-center-middle" id={i}>
          <div className="flex-center-middle align-center"> {i + 1}</div>
        </HeaderCell>
      ))}
      {array.map((i) => (i === 0 || i === 10) ? null : (
        <RowHeaderCell className="flex-center-middle" id={alphabet[i]}>
          <div className="flex-center-middle align-center"> {alphabet[i]}</div>
        </RowHeaderCell>
      ))}
      {array.map((i) => (
        array.map((a) => {
          let divider = "-"
          if ((a - 1 + i) % 6 === 0 && !(a & 1)) divider = "💰️"
          else if ((a - 1 - i - 2) % 6 === 0 && (a & 1)) divider = "💠️"
          else if (a === i && (a + 1) % 3 === 0) divider = "🚀️"
          else if (a === (width - 1 - i) && (a + 1) % 3 === 0) divider = "🚀️"
          else if (a === i && (a + 1) % 5 === 0) divider = "💣️"
          else if (a === (width - 1 - i) && (a + 1) % 5 === 0) divider = "💣️"
          else if (a === i && (a + 4) % 5 === 0) divider = "💣️"
          else if (a === (width - 1 - i) && (a + 4) % 5 === 0) divider = "💣️"

          let text = alphabet[i] + divider + (a + 1)
          if (a === 10 || a === 0 || i === 0 || i === 10) return null
          const backgroundColor = getCellColor(a, i, 'main')
          const defaultBackgroundColor = divider === "🚀️" ? "pink" : ((i + a * 11) > 60) ^ ((i + a) % 4 === 0 || (i - a) % 3 === 0) ? "#DDD" : "#FFF";
          return (
            <TableCell
              onClick={() => onClickCell(a, i, 'main')}
              backgroundColor={backgroundColor || defaultBackgroundColor}
              row={alphabet[a]}
              column={i}
              style={{
                width: 50,
                minWidth: 0,
                padding: 0,
                border: "solid 1px #BBB",
                cursor: "pointer",
                color: backgroundColor ? defaultBackgroundColor === 'pink' ? 'pink' : defaultBackgroundColor === "#DDD" ? "#CCC" : "#FFF" : "#666"
              }}
            >
              <div className={"flex-center-middle align-center" + (backgroundColor ? " bold" : "")}>
                {text}
              </div>
            </TableCell>
          )
        }).filter(v => v))).flat()}
    </Table >
  )

  const walkJsx = (
    <Table rowHeight={25} hideRowHeaders hideColumnHeaders style={{ width: walkArray.length * 25 }}>
      {walkArray.map((i) => (
        <HeaderCell className="flex-center-middle" id={i}>
          <div className="flex-center-middle align-center"> {i + 1}</div>
        </HeaderCell>
      ))}
      {walkArray.map((i) => (
        <RowHeaderCell className="flex-center-middle" id={alphabet[i]}>
          <div className="flex-center-middle align-center"> {alphabet[i]}</div>
        </RowHeaderCell>
      ))}
      {walkArray.map((i) => (
        walkArray.map((a) => {
          let divider = ""

          if ((!a && !i) || (a === walkArray.length - 1 && i === walkArray.length - 1)) divider = "🔷️"
          else if ((!a && i === walkArray.length - 1) || (a === walkArray.length - 1 && !i)) divider = "🔶️"
          else if ((a + i) % 4 === 0 && a % 4 === 0) divider = "💰️"
          else if ((a + i) % 8 === 0 && (a + 2) % 8 === 0) divider = "🔷️"
          else if ((a + i) % 8 === 0 && (a + -2) % 8 === 0) divider = "🔶️"
          else if (i < 6 && (a + i + 5) % 8 === 0 && (a - 2) % 8 === 0) divider = "💣️"
          else if ((a + i + 4) % 8 === 0 && (a - 2) % 8 === 0) divider = "💰️"
          else if (i < 6 && (a + i + 3) % 8 === 0 && (a - 2) % 8 === 0) divider = "💣️"
          else if ((a === ((walkArray.length - 1) / 2)) && (i === ((walkArray.length - 1) / 2))) divider = "🔲️"
          else if (i > 6 && (a + 1 + i + 4) % 8 === 0 && (a + 1 - 2) % 8 === 0) divider = "💣️"
          else if (i > 6 && (a - 1 + i + 4) % 8 === 0 && (a - 1 - 2) % 8 === 0) divider = "💣️"
          else if ((a + i + 2 + 4) % 8 === 0 && (a + 1 + 2) % 8 === 0) divider = "💣️"
          else if ((a + i + 4) % 8 === 0 && (a - 1 + 2) % 8 === 0) divider = "💣️"
          else if ((a + i + 4) % 8 === 0 && (a + 1 + 2) % 8 === 0) divider = "💣️"
          else if ((a + i + 2) % 8 === 0 && (a - 1 + 2) % 8 === 0) divider = "💣️"

          return (
            <TableCell
              onClick={() => onClickCell(a, i, 'walk')}
              backgroundColor={getCellColor(a, i, 'walk') || (a & 1 || i === ((walkArray.length - 1) / 4) || i === (walkArray.length - 1 - (walkArray.length - 1) / 4) ? "#DDD" : "#FFF")}
              row={alphabet[a]}
              column={i}
              style={{
                width: 25,
                minWidth: 0,
                padding: 0,
                cursor: "pointer",
                border: "solid 1px #BBB",
                color: "#BBB"
              }}
            >
              <div className="flex-center-middle align-center">
                {divider}
              </div>
            </TableCell>
          )
        }).filter(v => v))).flat()}
    </Table >
  )
  return (
    <div className="fill scroll-y">
      <LayoutDrawer>
        <Drawer className='padded-lg flex-center-middle' size="auto">
          {Number.isFinite(pc1) ? <div className={'inline'} onClick={() => setPc1()}>{polyCards[pc1]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "lightblue" }} onClick={() => onClickPc(setPc1)}>Shape Card 1</button>}
          {Number.isFinite(pc2) ? <div className={'inline'} onClick={() => setPc2()}>{polyCards[pc2]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "lightblue" }} onClick={() => onClickPc(setPc2)}>Shape Card 2</button>}
          {Number.isFinite(rc1) ? <div className={'inline'} onClick={() => setRc1()}>{redirectCards[rc1]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "orange" }} onClick={() => onClickRc(setRc1)}>Draw Redirect Card 1</button>}
          {Number.isFinite(rc2) ? <div className={'inline'} onClick={() => setRc2()}>{redirectCards[rc2]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "orange" }} onClick={() => onClickRc(setRc2)}>Draw Redirect Card 2</button>}
          {Number.isFinite(rc3) ? <div className={'inline'} onClick={() => setRc3()}>{redirectCards[rc3]} </div> : <button style={{ margin: 3, cursor: "pointer", backgroundColor: "orange" }} onClick={() => onClickRc(setRc3)}>Draw Redirect Card 3</button>}
        </Drawer>
        <Drawer className='flex-center-middle'>
          <div className="flex-middle flex-distribute fill-width" style={{ maxWidth: 900 }} >
            <div className="align-center">
              Your Building Site
              {gridJsx}
            </div>
            <div className="align-center">
              Your Mars-Rover
              {walkJsx}
            </div>
          </div>
        </Drawer>
        <Drawer size='auto' className='flex-center-middle'>
          <div className="fill-width margin-sm padded" style={{ border: "solid #222 1px", maxWidth: 600 }}>
            <div className="align-center fill-width padded bold font-md" style={{ textDecoration: "underline" }}>
              Shop
              </div>
            <div className='flex-distribute'>
              <div>2x💰️: +1 Redirect Card</div>
              <div>3x💰️: +1 Shape Card</div>
              <div>5x💰️: Fill 1 Grid Location</div>
            </div>
          </div>
        </Drawer>
        <Drawer className={'padded-md flex-center-middle'}>
          {getShapeTableJsx("💰️", "💰️", 4, getCellColor, onClickCell, "orange")}
        </Drawer>
        <Drawer size={"auto"} className={'padded-lg flex-center-middle'} style={{ paddingTop: 0 }} >
          Points
          <div style={{ paddingRight: 10 }}>
            ⭐️
        </div>
          <Table size="small" hideColumnHeaders rowHeight={25} width={600}>
            {[...Array(12).keys()].map((i) => (
              <HeaderCell className="flex-center-middle" id={i}>
                <div className="flex-center-middle align-center"> {i + 1}</div>
              </HeaderCell>
            ))}
            {[...Array(4).keys()].map((i) => {
              const interval = i - 1 && i ? (i - 1) * 2 : 1
              return (
                <RowHeaderCell className="flex-center-middle" id={i} style={{
                  width: (1 / 13 * 100) + "%",
                  padding: 0,
                  border: "solid 1px #CCC",
                  color: "#AAA",
                }}
                >
                  <div className="padded no-wrap flex-center-middle">
                    <div style={{ color: interval === 2 ? "orange" : interval === 4 ? "red" : undefined }}>
                      +{interval}
                    </div>
                  </div>
                </RowHeaderCell>
              )
            })}
            {[...Array(4).keys()].map((r) => [...Array(24).keys()].map((c) => {
              var value = (c + 1) * (r > 2 ? 4 : (r > 1 ? 2 : 1)) + (r * 12) + (r > 2 ? 12 : 0)
              var x = (c + 1 + r * 24);
              var bonus = value === 96 ? "END" : x % 16 === 0 ? "🔶️" : x % 8 === 0 ? "🔷️" : (x % 4 === 0 || value === 72 || value === 56) ? "💰️" : ""
              return (
                <TableCell
                  className="flex-center-middle"
                  onClick={() => onClickCell(r, c, 'points')}
                  backgroundColor={getCellColor(r, c, 'points')}
                  row={r}
                  column={c}
                  style={{
                    cursor: "pointer",
                    width: (1 / 13 * 100) + "%",
                    padding: 0,
                    border: "solid 1px #CCC",
                    color: "#AAA",
                  }}
                >
                  <div className={bonus ? "flex-middle flex-justify padded" : "flex-center-middle padded"}>
                    <div>
                      {value}
                    </div>
                    <div>
                      {bonus}
                    </div>
                  </div>
                </TableCell>
              )
            })).flat()}
            {/* {[...Array(2).keys()].map((r) => [...Array(24).keys()].map((c) => {
              var extraVal = (c + 1) * (r + 1) + increasingSum(r, 24) > 40 ? 2 : 0
              var value = (c + 1) * (r + extraVal + 1) + increasingSum(r, 24)
              var bonus = value === 12 ? "END" : (c + 1 + r * 24) % 16 === 0 ? "🔶️" : (c + 1 + r * 24) % 8 === 0 ? "🔷️" : (c + 1 + r * 24) % 4 === 0 ? "💰️" : ""
              return (
                <TableCell
                  className="flex-center-middle"
                  onClick={() => onClickCell(r, c, 'points')}
                  backgroundColor={getCellColor(r, c, 'points', value > 85 ? '#FFF' : value > 24 ? "#EEE" : "#DDD")}
                  row={r}
                  column={c}
                  style={{
                    width: "5%",
                    padding: 0,
                    border: "solid 1px #CCC",
                    color: "#AAA",
                  }}
                >
                  <div className={bonus ? "flex-middle flex-justify" : "flex-center-middle"}>
                    {bonus && <div className="padded" style={{ visibility: "hidden" }}></div>}
                    <div>{value}</div>
                    {bonus && <div className="padded"> {bonus} </div>}
                  </div>
                </TableCell>
              )
            })).flat()} */}
          </Table>
        </Drawer>
        <Drawer size={'auto'} className={'padded-lg flex-center-middle'} style={{ paddingTop: 0 }}>
          <div style={{ paddingRight: 10 }}>
            💣️
          </div>
          <Table size="small" hideRowHeaders hideColumnHeaders rowHeight={25} width={40 * 15}>
            {[...Array(15).keys()].map((i) => (
              <HeaderCell className="flex-center-middle" id={i}>
                <div className="flex-center-middle align-center"> {i + 1}</div>
              </HeaderCell>
            ))}
            {[...Array(1).keys()].map((r) => [...Array(15).keys()].map((c) => (
              <TableCell
                className="flex-center-middle"
                onClick={() => onClickCell(r, c, 'bombs')}
                backgroundColor={getCellColor(r, c, 'bombs')}
                row={r}
                column={c}
                style={{
                  width: 40,
                  padding: 0,
                  cursor: "pointer",
                  border: "solid 1px #CCC",
                  color: "#CCC"
                }}>
                <div className="flex-center-middle align-center"> {(-6 * ((c + 1) + r * 15))}</div>
              </TableCell>
            ))).flat()}
          </Table>
        </Drawer>
        <Drawer >
          <div className="flex-center-middle fill">
            Secret Objectives (Fit these in empty spaces at game end to gain their points)
          </div>
          <div className="flex-center-middle fill">
            {[secretPoly3, secretPoly4, secretPoly5].map(v => generatePolyominos(v, true))}
          </div>
        </Drawer>
      </LayoutDrawer >
    </div >
  );
}

function getShapeTableJsx(shape, reward, mod, getCellColor, onClickCell, id) {
  return <Table size="small" hideRowHeaders hideColumnHeaders rowHeight={25} width={500}>
    {[...Array(20).keys()].map((i) => (
      <HeaderCell className="flex-center-middle" id={i}>
        <div className="flex-center-middle align-center"> {i + 1}</div>
      </HeaderCell>
    ))}
    {[...Array(4).keys()].map((r) => [...Array(20).keys()].map((c) => (
      <TableCell
        className="flex-center-middle"
        onClick={() => onClickCell(r, c, id)}
        backgroundColor={getCellColor(r, c, id, "#FFF")}
        row={r}
        column={c}
        style={{
          minWidth: 0,
          padding: 0,
          cursor: "pointer",
          border: "solid 1px #CCC",
          color: "#CCC"

        }}
      >
        <div className="flex-center-middle align-center">
          {((c + 1) + r * 20) % mod === 0 ? reward : shape}
        </div>
      </TableCell>
    ))).flat()}
  </Table>
}

function generateTerraformCards(type) {
  const width = 5;
  const cells = (width * width - 1) / 2
  return [...Array(cells).keys()].map((cardIndex) => {

    const headersJsx = [...Array(width).keys()].map((i) => <HeaderCell id={i} />)
    const rowHeadersJsx = [...Array(width).keys()].map((i) => <RowHeaderCell id={i} />)

    const cellsJsx = [...Array(cells).keys()].map((i) => {
      const r = Math.floor(i / width);
      const c = i % width;

      const rRotated = width - c - 1
      const cRotated = r

      const r2 = width - r - 1;
      const c2 = width - c - 1;

      const r2Rotated = width - c2 - 1
      const c2Rotated = r2

      return (
        [
          <TableCell
            className="flex-center-middle"
            row={r}
            column={c}
            style={{
              width: 20,
              minWidth: 0,
              padding: 0,
              border: "solid 1px #CCC",
              cursor: "pointer",
              color: "#CCC"
            }}
          >
            <div className="flex-center-middle align-center">
              {(c + r * width) === cardIndex || (cRotated + rRotated * width) === cardIndex || (c2Rotated + r2Rotated * width) === cardIndex ? "🔴️" : ""}
            </div>
          </TableCell>,
          <TableCell
            className="flex-center-middle"
            row={r2}
            column={c2}
            style={{
              width: 20,
              minWidth: 0,
              padding: 0,
              border: "solid 1px #CCC",
              color: "#CCC"
            }}
          >
            <div className="flex-center-middle align-center">
              {(c2 + r2 * width) === (width * width - cardIndex - 1) || (cRotated + rRotated * width) === (width * width - cardIndex - 1) || (c2Rotated + r2Rotated * width) === (width * width - cardIndex - 1) ? "🔴️" : ""}
            </div>
          </TableCell>
        ]
      )
    }).flat()

    const centerCellJsx = (
      <TableCell
        className="flex-center-middle"
        row={(width - 1) / 2}
        column={(width - 1) / 2}
        style={{
          width: 20,
          minWidth: 0,
          padding: 0,
          border: "solid 1px #CCC",
          color: "#CCC"
        }}
      >
        <div className="flex-center-middle align-center">
          ⭕️
        </div>
      </TableCell>
    )

    return (
      <Table hideColumnHeaders hideRowHeaders rowHeight={50} width={250} className="inline">
        {[headersJsx, rowHeadersJsx, cellsJsx, centerCellJsx].flat()}
      </Table>
    )
  })
}

const rewards = {
  1: { vp: 0, coin: 4 },
  2: { vp: 0, coin: 5 },
  3: { vp: 4, coin: 2 },
  4: { vp: 4, coin: 4 },
  5: { vp: 8, coin: 2 },
  6: { vp: 8, coin: 4 }
}

function generatePolyominos(shape, hideCoins) {

  const rows = maxBy(shape, "1")[1] + 1;
  const columns = maxBy(shape, "0")[0] + 1;

  return (
    <div className="inline-top relative" style={{ width: '2in', height: "3in", border: "solid #EEE 1px" }}>
      <div className="bottom-right padded-mdn font-lg">
        {!hideCoins && <div>
          {rewards[shape.length].coin} 💰️
        </div>}
        {rewards[shape.length].vp} ⭐️
      </div>
      <div className="flex-center-middle fill">
        <div>
          <Table noShadow hideColumnHeaders hideRowHeaders rowHeight={40} width={columns * 40} style={{ boxShadow: 'none' }} >
            {[...Array(columns).keys()].map((i) => (
              <HeaderCell className="flex-center-middle" id={i}>
                <div className="flex-center-middle align-center"> {i + 1}</div>
              </HeaderCell>
            ))}
            {[...Array(rows).keys()].map((r) => [...Array(columns).keys()].map((c) => {
              const cellIsBlock = shape.find(([col, row]) => col === c && row === r);
              return (
                <TableCell
                  className="flex-center-middle"
                  row={r}
                  column={c}
                  backgroundColor={cellIsBlock ? "#EEE" : "transparent"}
                  style={{
                    width: 50,
                    padding: 0,
                    border: cellIsBlock ? "solid 1px #CCC" : "none",
                    boxShadow: cellIsBlock && "5px 5px 0px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)"
                    // color: !cellIsBlock? "lightblue" : "#FFF",
                  }}
                />
              )
            })).flat()}
          </Table>
        </div>
      </div>
    </div>
  )
}
